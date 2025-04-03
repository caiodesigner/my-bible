// src/database.js
import initSqlJs from 'sql.js';

// Exportando as funções corretamente
export async function loadDatabase() {
  // Carregar o arquivo SQLite
  const SQL = await initSqlJs();
  const response = await fetch('/versions/ACF/ACF.sqlite'); // Coloque o caminho correto para o banco de dados
  const buffer = await response.arrayBuffer();

  // Criar a instância do banco de dados em memória
  const db = new SQL.Database(new Uint8Array(buffer));

  return db;
}

export async function getBooks(db) {
  const res = db.exec("SELECT DISTINCT livro FROM biblia");
  return res[0].values;  // Lista de livros
}

export async function getChapters(db, book) {
  const res = db.exec("SELECT DISTINCT capitulo FROM biblia WHERE livro = ?", [book]);
  return res[0].values;  // Lista de capítulos
}

export async function getVerses(db, book, chapter) {
  const res = db.exec("SELECT versiculo, texto FROM biblia WHERE livro = ? AND capitulo = ?", [book, chapter]);
  return res[0].values;  // Lista de versículos
}
