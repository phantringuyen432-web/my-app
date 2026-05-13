const db = require('../config/db');

// GET
exports.getTodos = (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// POST
exports.createTodo = (req, res) => {
  const { text } = req.body;

  db.query(
    'INSERT INTO todos (text) VALUES (?)',
    [text],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        id: result.insertId,
        text
      });
    }
  );
};

// DELETE
exports.deleteTodo = (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM todos WHERE id = ?',
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Deleted' });
    }
  );
};