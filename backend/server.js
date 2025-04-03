// backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
const port = 5000;  // A porta onde a API estará disponível

// Configurações de CORS para permitir chamadas do frontend
app.use(cors());

// Cria uma instância do banco SQLite
const db = new sqlite3.Database('./versions/ACF/ACF.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Rota para obter todos os livros
app.get('/api/books', (req, res) => {
  const query = 'SELECT name FROM book';  // Consultar a coluna 'name' da tabela 'book'
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta de livros:', err.message);
      return res.status(500).json({ error: 'Erro ao carregar os livros' });
    }
    res.json(rows);  // Retorna a lista de livros
  });
});


// Rota para obter capítulos de um livro
app.get('/api/chapters/:book', (req, res) => {
  const { book } = req.params;
  const query = `
    SELECT DISTINCT chapter 
    FROM verse 
    JOIN book ON verse.book_id = book.id 
    WHERE book.name = ?`;  // Relacionando pelo nome do livro
  db.all(query, [book], (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta de capítulos:', err.message);
      return res.status(500).json({ error: 'Erro ao carregar os capítulos' });
    }
    res.json(rows);  // Retorna a lista de capítulos
  });
});


// Rota para obter versículos de um capítulo de um livro
app.get('/api/verses/:book/:chapter', (req, res) => {
  const { book, chapter } = req.params;
  const query = `
    SELECT verse, text 
    FROM verse 
    JOIN book ON verse.book_id = book.id 
    WHERE book.name = ? AND verse.chapter = ?`;  // Relacionando livro e capítulo
  db.all(query, [book, chapter], (err, rows) => {
    if (err) {
      console.error('Erro ao executar a consulta de versículos:', err.message);
      return res.status(500).json({ error: 'Erro ao carregar os versículos' });
    }
    res.json(rows);  // Retorna a lista de versículos
  });
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
