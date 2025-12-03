// College Guide - Main JavaScript

// API Configuration
const API_URL = 'https://college-guide-v2-frontend.onrender.com';

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Get current user
async function getCurrentUser() {
    if (!isLoggedIn()) return null;

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        }
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Update UI based on auth state
function updateAuthUI() {
    const loginBtn = document.getElementById('openLogin');
    const signupBtn = document.getElementById('openSignup');
    const navButtons = loginBtn?.parentElement;

    if (isLoggedIn() && navButtons) {
        const userName = localStorage.getItem('userName') || 'User';
        navButtons.innerHTML = `
            <span class="text-white mr-4">Welcome, ${userName}!</span>
            <button id="logoutBtn" class="px-4 py-2 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-100">Logout</button>
        `;

        // Add logout handler
        document.getElementById('logoutBtn')?.addEventListener('click', function () {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            location.reload();
        });
    }
}

// Initialize AOS and Feather Icons
document.addEventListener('DOMContentLoaded', function () {
    AOS.init();
    feather.replace();

    // Update UI based on login state
    updateAuthUI();

    // Auth Modals
    function modal(id) { return document.getElementById(id); }
    function show(el) { el.classList.remove('hidden'); }
    function hide(el) { el.classList.add('hidden'); }

    var loginBtn = document.getElementById('openLogin');
    var signupBtn = document.getElementById('openSignup');

    // Build modal markup once
    if (!document.getElementById('auth-modals')) {
        var div = document.createElement('div');
        div.id = 'auth-modals';
        div.innerHTML = `
        <div id="modal-backdrop" class="hidden fixed inset-0 bg-black/50 z-40"></div>
        <div id="loginModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="p-6 border-b flex justify-between items-center"><h3 class="text-lg font-semibold">Log In</h3><button data-close="loginModal" class="text-gray-500">✕</button></div>
                <form id="loginForm" class="p-6 space-y-4">
                    <input class="w-full border rounded p-3" name="email" type="email" placeholder="Email" required>
                    <input class="w-full border rounded p-3" name="password" type="password" placeholder="Password" required>
                    <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">Log In</button>
                    <p id="loginError" class="text-sm text-red-600"></p>
                </form>
            </div>
        </div>
        <div id="signupModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="p-6 border-b flex justify-between items-center"><h3 class="text-lg font-semibold">Sign Up</h3><button data-close="signupModal" class="text-gray-500">✕</button></div>
                <form id="signupForm" class="p-6 space-y-4">
                    <input class="w-full border rounded p-3" name="name" type="text" placeholder="Full Name" required>
                    <input class="w-full border rounded p-3" name="email" type="email" placeholder="Email" required>
                    <input class="w-full border rounded p-3" name="password" type="password" placeholder="Password" required>
                    <button class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">Create Account</button>
                    <p id="signupError" class="text-sm text-red-600"></p>
                </form>
            </div>
        </div>`;
        document.body.appendChild(div);
    }

    var backdrop = document.getElementById('modal-backdrop');
    loginBtn && loginBtn.addEventListener('click', function () { show(backdrop); show(modal('loginModal')); });
    signupBtn && signupBtn.addEventListener('click', function () { show(backdrop); show(modal('signupModal')); });
    document.querySelectorAll('[data-close]')?.forEach(function (btn) {
        btn.addEventListener('click', function () { hide(backdrop); hide(modal(btn.getAttribute('data-close'))); });
    });

    async function api(path, method, body) {
        var res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : ''
            },
            body: body ? JSON.stringify(body) : undefined
        });
        var data = await res.json().catch(function () { return {}; });
        if (!res.ok) throw new Error(data.error || 'Request failed');
        return data;
    }

    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');

    loginForm && loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        document.getElementById('loginError').textContent = '';
        var form = new FormData(loginForm);
        try {
            var out = await api('/auth/login', 'POST', {
                email: form.get('email'),
                password: form.get('password')
            });
            localStorage.setItem('token', out.token);
            localStorage.setItem('userName', out.user.name);
            hide(backdrop);
            hide(modal('loginModal'));
            alert('Logged in as ' + out.user.name);
            updateAuthUI();
            loadTodos(); // Reload todos after login
        } catch (err) {
            document.getElementById('loginError').textContent = err.message;
        }
    });

    signupForm && signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        document.getElementById('signupError').textContent = '';
        var form = new FormData(signupForm);
        try {
            var out = await api('/auth/register', 'POST', {
                name: form.get('name'),
                email: form.get('email'),
                password: form.get('password')
            });
            localStorage.setItem('token', out.token);
            localStorage.setItem('userName', out.user.name);
            hide(backdrop);
            hide(modal('signupModal'));
            alert('Welcome ' + out.user.name + '!');
            updateAuthUI();
            loadTodos(); // Load todos after signup
        } catch (err) {
            document.getElementById('signupError').textContent = err.message;
        }
    });

    // Department Timetable
    var tabs = document.querySelectorAll('.dept-tab');
    var panels = document.querySelectorAll('.dept-panel');

    // Shared timeslots
    var timeSlots = ['09:00-09:55', '10:00-10:55', '11:00-11:55', '12:00-12:55', '01:00-02:00', '02:00-02:55', '03:00-03:55', '04:00-04:55', '05:00-05:55'];
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Color palette
    var slotColors = {
        'L': '#ffe08a', 'F': '#ffd1dc', 'E': '#ffab40', 'H': '#ffee58', 'G': '#3b82f6',
        'I': '#ec4899', 'B': '#8b5cf6', 'U': '#9ca3af', 'Z': '#10b981', 'P': '#7c3aed',
        'V': '#34d399', 'D': '#93c5fd', 'X': '#fbbf24'
    };

    // Department data
    var departments = {
        ece: {
            legend: {
                'L': 'Linear Algebra & Matrix Analysis',
                'F': 'Calculus',
                'E': 'Problem Solving with C Programming',
                'H': 'Digital Electronics using Verilog',
                'G': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'X': 'IT Workshop: Full Stack Prototyping with AI Support',
                'U': 'Environmental Studies',
                'Z': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['', 'X', 'H', 'H', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['X', 'X', 'L', 'P', '', 'H', 'F', 'I', 'I'],
                'Wednesday': ['H', 'G', '', 'E', '', '', 'Z', 'F', 'F'],
                'Thursday': ['G', 'G', 'I', 'B', '', 'Z', 'Z', 'E', ''],
                'Friday': ['', 'U', 'U', '', '', 'B', 'B', 'L', 'L']
            }
        },
        cse: {
            legend: {
                'E': 'Linear Algebra & Matrix Analysis',
                'H': 'Calculus',
                'L': 'Problem Solving with C Programming',
                'F': 'Digital Electronics using Verilog',
                'G': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'V': 'IT Workshop with AI Support',
                'D': 'Environmental Studies',
                'X': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['', 'H', 'H', 'F', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['X', 'X', 'V', 'P', '', 'H', '', 'I', 'I'],
                'Wednesday': ['', 'G', 'X', 'E', '', 'V', 'V', 'F', 'F'],
                'Thursday': ['', '', 'I', 'B', '', '', 'L', 'D', 'D'],
                'Friday': ['G', 'G', 'L', 'F', '', 'B', 'B', 'L', 'L']
            }
        },
        dsai: {
            legend: {
                'E': 'Linear Algebra & Matrix Analysis',
                'D': 'Calculus',
                'L': 'Problem Solving with C Programming',
                'G': 'Digital Electronics using Verilog',
                'F': 'Internet of Things',
                'I': 'ILC (Advance1)',
                'Z': 'IT Workshop with AI Support',
                'V': 'Environmental Studies',
                'U': 'Entrepreneurship & Design Thinking',
                'B': 'ILC (Basic)',
                'P': 'ILC (Advance2)'
            },
            grid: {
                'Monday': ['G', 'U', '', '', '', 'P', 'P', 'E', 'E'],
                'Tuesday': ['', 'D', 'L', 'P', '', '', 'F', 'I', 'I'],
                'Wednesday': ['', 'G', 'Z', 'E', '', 'V', 'V', 'F', 'F'],
                'Thursday': ['G', 'G', 'I', 'B', '', 'Z', 'Z', 'D', 'D'],
                'Friday': ['U', 'U', 'L', '', '', 'B', 'B', 'L', 'L']
            }
        }
    };

    function buildTable(deptKey, mountEl, legendEl) {
        var data = departments[deptKey];
        if (!data) return;

        var table = document.createElement('table');
        table.className = 'w-full text-sm';

        var thead = document.createElement('thead');
        thead.className = 'bg-indigo-100';
        var headRow = document.createElement('tr');
        var thTime = document.createElement('th');
        thTime.className = 'p-3 text-left';
        thTime.textContent = 'Day/Time';
        headRow.appendChild(thTime);

        timeSlots.forEach(function (t) {
            var th = document.createElement('th');
            th.className = 'p-3 text-left whitespace-nowrap';
            th.textContent = t;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        var tbody = document.createElement('tbody');
        days.forEach(function (day) {
            var row = document.createElement('tr');
            row.className = 'border-b hover:bg-gray-50';
            var tdDay = document.createElement('td');
            tdDay.className = 'p-3 font-semibold';
            tdDay.textContent = day;
            row.appendChild(tdDay);

            var slots = data.grid[day] || [];
            for (var i = 0; i < timeSlots.length; i++) {
                var code = slots[i] || '';
                var td = document.createElement('td');
                td.className = 'p-2 text-center';
                if (code && code !== 'X') {
                    td.textContent = code;
                    td.style.backgroundColor = slotColors[code] || '#e5e7eb';
                    td.className += ' rounded text-gray-900 font-medium';
                } else if (code === 'X') {
                    td.textContent = 'X';
                    td.style.backgroundColor = slotColors['X'] || '#fde68a';
                    td.className += ' rounded text-gray-900 font-medium';
                } else {
                    td.textContent = '';
                }
                row.appendChild(td);
            }
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Render
        mountEl.innerHTML = '';
        var wrapper = document.createElement('div');
        wrapper.className = 'bg-white rounded-lg overflow-x-auto border';
        wrapper.appendChild(table);
        mountEl.appendChild(wrapper);

        // Legend
        if (legendEl) {
            legendEl.innerHTML = '';
            var legendTitle = document.createElement('h3');
            legendTitle.className = 'text-sm font-semibold text-gray-700 mb-2';
            legendTitle.textContent = 'Slot Legend';
            legendEl.appendChild(legendTitle);

            var list = document.createElement('div');
            list.className = 'grid sm:grid-cols-2 md:grid-cols-3 gap-2';
            Object.keys(data.legend).forEach(function (code) {
                var item = document.createElement('div');
                item.className = 'flex items-center gap-2';
                var swatch = document.createElement('span');
                swatch.className = 'inline-block w-4 h-4 rounded';
                swatch.style.backgroundColor = slotColors[code] || '#e5e7eb';
                var label = document.createElement('span');
                label.className = 'text-xs text-gray-700';
                label.textContent = code + ' - ' + data.legend[code];
                item.appendChild(swatch);
                item.appendChild(label);
                list.appendChild(item);
            });
            legendEl.appendChild(list);
        }
    }

    function activate(targetId) {
        panels.forEach(function (p) { p.classList.add('hidden'); });
        tabs.forEach(function (t) {
            t.classList.remove('bg-indigo-600', 'text-white', 'shadow', 'hover:bg-indigo-700');
            t.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
        });

        var target = document.querySelector(targetId);
        if (target) { target.classList.remove('hidden'); }

        var activeTab = Array.prototype.find.call(tabs, function (t) {
            return t.getAttribute('data-target') === targetId;
        });
        if (activeTab) {
            activeTab.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
            activeTab.classList.add('bg-indigo-600', 'text-white', 'shadow', 'hover:bg-indigo-700');
        }

        // Build for current panel
        var mount = target.querySelector('.timetable-mount');
        var legend = target.querySelector('.legend-mount');
        if (mount) {
            var key = targetId.includes('ece') ? 'ece' : targetId.includes('cse') ? 'cse' : 'dsai';
            buildTable(key, mount, legend);
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            activate(tab.getAttribute('data-target'));
        });
    });

    // Ensure first tab visible on load
    var initial = document.querySelector('.dept-tab')?.getAttribute('data-target');
    if (initial) { activate(initial); }

    // To-Do List functionality
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');

    // Load todos from backend
    async function loadTodos() {
        if (!todoList) return;

        if (!isLoggedIn()) {
            todoList.innerHTML = '<li class="text-center text-gray-500 py-4">Please log in to view your todos</li>';
            return;
        }

        try {
            const response = await api('/todos', 'GET');
            todoList.innerHTML = '';

            if (response.todos && response.todos.length > 0) {
                response.todos.forEach(todo => {
                    addTodoToDOM(todo);
                });
            } else {
                todoList.innerHTML = '<li class="text-center text-gray-500 py-4">No todos yet. Add one above!</li>';
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            todoList.innerHTML = '<li class="text-center text-red-500 py-4">Error loading todos. Please try again.</li>';
        }
    }

    // Add todo to DOM
    function addTodoToDOM(todo) {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition';
        li.dataset.todoId = todo._id;
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="flex items-center flex-1">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} class="mr-3 h-5 w-5 text-indigo-600 rounded">
                <span class="todo-text ${todo.completed ? 'line-through text-gray-500' : ''}">${todo.text}</span>
            </div>
            <button class="text-red-500 hover:text-red-700 delete-todo">
                <i data-feather="trash-2" class="h-4 w-4"></i>
            </button>
        `;

        todoList.appendChild(li);
        feather.replace();

        // Checkbox toggle
        li.querySelector('input[type="checkbox"]').addEventListener('change', async function (e) {
            const completed = e.target.checked;
            li.classList.toggle('completed');
            li.querySelector('.todo-text').classList.toggle('line-through');
            li.querySelector('.todo-text').classList.toggle('text-gray-500');

            try {
                await api(`/todos/${todo._id}`, 'PUT', { completed });
            } catch (error) {
                console.error('Error updating todo:', error);
                // Revert on error
                e.target.checked = !completed;
                li.classList.toggle('completed');
                li.querySelector('.todo-text').classList.toggle('line-through');
                li.querySelector('.todo-text').classList.toggle('text-gray-500');
            }
        });

        // Delete button
        li.querySelector('.delete-todo').addEventListener('click', async function () {
            try {
                await api(`/todos/${todo._id}`, 'DELETE');
                li.remove();

                // Check if list is empty
                if (todoList.children.length === 0) {
                    todoList.innerHTML = '<li class="text-center text-gray-500 py-4">No todos yet. Add one above!</li>';
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
                alert('Error deleting todo. Please try again.');
            }
        });
    }

    // Add new todo
    addTodoBtn && addTodoBtn.addEventListener('click', async function () {
        const text = todoInput.value.trim();

        if (!text) return;

        if (!isLoggedIn()) {
            alert('Please log in to add todos');
            return;
        }

        try {
            const response = await api('/todos', 'POST', { text });

            // Remove "no todos" message if present
            if (todoList.querySelector('.text-gray-500')) {
                todoList.innerHTML = '';
            }

            addTodoToDOM(response.todo);
            todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('Error adding todo. Please try again.');
        }
    });

    // Add todo on Enter key
    todoInput && todoInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTodoBtn.click();
        }
    });

    // Load todos on page load
    loadTodos();

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    let conversationHistory = [];

    // Toggle chatbot window
    chatbotToggle && chatbotToggle.addEventListener('click', function () {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
        feather.replace();
    });

    chatbotClose && chatbotClose.addEventListener('click', function () {
        chatbotWindow.classList.add('hidden');
    });

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`;

        messageDiv.innerHTML = `
            <div class="${isUser ? 'bg-indigo-600' : 'bg-indigo-600'} text-white rounded-full p-2">
                <i data-feather="${isUser ? 'user' : 'bot'}" class="h-4 w-4"></i>
            </div>
            <div class="${isUser ? 'bg-indigo-100' : 'bg-white'} rounded-lg p-3 shadow max-w-[80%]">
                <p class="text-sm ${isUser ? 'text-indigo-900' : 'text-gray-800'}">${message}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        feather.replace();
    }

    // Add typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'flex items-start space-x-2';
        typingDiv.innerHTML = `
            <div class="bg-indigo-600 text-white rounded-full p-2">
                <i data-feather="bot" class="h-4 w-4"></i>
            </div>
            <div class="bg-white rounded-lg p-3 shadow">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        feather.replace();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Send message to chatbot
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        try {
            const response = await api('/chatbot/message', 'POST', {
                message: message,
                conversationHistory: conversationHistory
            });

            // Remove typing indicator
            removeTypingIndicator();

            // Add bot response
            addMessage(response.reply, false);

            // Update conversation history
            conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: response.reply }
            );

            // Keep only last 10 messages in history
            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }

        } catch (error) {
            removeTypingIndicator();
            console.error('Chatbot error:', error);
            addMessage('Sorry, I encountered an error. Please try again or make sure the Gemini API key is configured.', false);
        }
    }

    // Send message on button click
    chatSend && chatSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput && chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

