const express = require('express');
const router = express.Router();

const {
    getTodos,
    createTodo,
    deleteTodo
} = require('../controllers/todoController');

router.get('/', getTodos);
router.post('/', createTodo);
router.delete('/:id', deleteTodo);

module.exports = router;