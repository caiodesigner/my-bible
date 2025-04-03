// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [livros, setLivros] = useState([]);
  const [capitulos, setCapitulos] = useState([]);
  const [versiculos, setVersiculos] = useState([]);
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [selectedCapitulo, setSelectedCapitulo] = useState(null);

  useEffect(() => {
    // Carregar os livros da API
    async function loadBooks() {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setLivros(response.data);
      } catch (error) {
        console.error('Erro ao carregar os livros:', error);
      }
    }
    loadBooks();
  }, []);

  const handleLivroClick = async (livro) => {
    setSelectedLivro(livro);
    setCapitulos([]);
    setVersiculos([]);

    // Carregar os capítulos do livro selecionado
    try {
      const response = await axios.get(`http://localhost:5000/api/chapters/${livro}`);
      setCapitulos(response.data);
    } catch (error) {
      console.error('Erro ao carregar os capítulos:', error);
    }
  };

  const handleCapituloClick = async (capitulo) => {
    setSelectedCapitulo(capitulo);
    setVersiculos([]);

    // Carregar os versículos do capítulo selecionado
    try {
      const response = await axios.get(`http://localhost:5000/api/verses/${selectedLivro}/${capitulo}`);
      setVersiculos(response.data);
    } catch (error) {
      console.error('Erro ao carregar os versículos:', error);
    }
  };

  // Função para voltar para a seleção de livros
  const handleBackToLivros = () => {
    setSelectedLivro(null);
    setCapitulos([]);
    setVersiculos([]);
  };

  // Função para voltar para a seleção de capítulos
  const handleBackToCapitulos = () => {
    setSelectedCapitulo(null);
    setVersiculos([]);
  };

  // Função para avançar um capítulo
  const handleAvancarCapitulo = () => {
    const nextCapitulo = selectedCapitulo + 1;
    if (capitulos.some((capitulo) => capitulo.chapter === nextCapitulo)) {
      handleCapituloClick(nextCapitulo);
    }
  };

  // Função para retroceder um capítulo
  const handleRetrocederCapitulo = () => {
    const prevCapitulo = selectedCapitulo - 1;
    if (prevCapitulo > 0 && capitulos.some((capitulo) => capitulo.chapter === prevCapitulo)) {
      handleCapituloClick(prevCapitulo);
    }
  };

  return (
    <div className="App">
      <h1>Bíblia - Versão ACF</h1>

      {/* Botão de Voltar - Condicional */}
      {(selectedCapitulo || versiculos.length > 0) && (
        <button onClick={handleBackToCapitulos}>Voltar para os capítulos</button>
      )}
      {selectedLivro && !selectedCapitulo && !versiculos.length && (
        <button onClick={handleBackToLivros}>Voltar para a seleção de livros</button>
      )}

      {/* Menu de livros */}
      {!selectedLivro && (
        <div>
          <h2>Selecione um Livro</h2>
          <div>
            {livros.length === 0 && <p>Carregando livros...</p>}
            {livros.length > 0 && livros.map((livro, index) => (
              <button key={index} onClick={() => handleLivroClick(livro.name || livro.livro)}>
                {livro.name || livro.livro} {/* Ajuste conforme o nome da chave no retorno da API */}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu de capítulos */}
      {selectedLivro && !selectedCapitulo && (
        <div>
          <h2>Capítulos de {selectedLivro}</h2>
          <div>
            {capitulos.map((capitulo, index) => (
              <button key={index} onClick={() => handleCapituloClick(capitulo.chapter || capitulo.capitulo)}>
                Capítulo {capitulo.chapter || capitulo.capitulo} {/* Ajuste conforme o nome da chave no retorno da API */}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu de versículos */}
      {selectedCapitulo && (
        <div>
          <h2>Versículos do Capítulo {selectedCapitulo} de {selectedLivro}</h2>
          {versiculos.map((versiculo, index) => (
            <div key={index}>
              <p><strong>{versiculo.verse}</strong>: {versiculo.text}</p>
            </div>
          ))}
          {/* Botões para avançar e retroceder capítulos */}
          <div>
            <button onClick={handleRetrocederCapitulo} disabled={selectedCapitulo <= 1}>
              Retroceder Capítulo
            </button>
            <button onClick={handleAvancarCapitulo}>
              Avançar Capítulo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
