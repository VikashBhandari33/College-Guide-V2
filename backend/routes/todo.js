const express = require('express');
const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected - require authentication
router.use(auth);

// @route   GET /api/todos
// @desc    Get all todos for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.userId })
            .sort({ createdAt: -1 });
        
        res.json({ todos });
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({ error: 'Server error while fetching todos' });
    }
});

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', [
    body('text').trim().notEmpty().withMessage('Todo text is required')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { text, completed } = req.body;

        const todo = new Todo({
            user: req.userId,
            text,
            completed: completed || false
        });

        await todo.save();

        res.status(201).json({
            message: 'Todo created successfully',
            todo
        });
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({ error: 'Server error while creating todo' });
    }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { text, completed } = req.body;

        // Find todo and verify ownership
        const todo = await Todo.findOne({ 
            _id: req.params.id, 
            user: req.userId 
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Update fields
        if (text !== undefined) todo.text = text;
        if (completed !== undefined) todo.completed = completed;

        await todo.save();

        res.json({
            message: 'Todo updated successfully',
            todo
        });
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({ error: 'Server error while updating todo' });
    }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete todo (verify ownership)
        const todo = await Todo.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.userId 
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ 
            message: 'Todo deleted successfully',
            todo
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({ error: 'Server error while deleting todo' });
    }
});

module.exports = router;
