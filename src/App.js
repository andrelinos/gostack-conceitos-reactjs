import React, { useState, useEffect } from 'react';
import api from './services/api';

import './styles.css';

function App() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    });
  }, []);

  async function handleAddRepository(e) {
    e.preventDefault();

    const response = await api.post('repositories', {
      title,
      url,
      techs: techs.split(',').map(tech => tech.trim()),
    });

    setRepositories([...repositories, response.data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);
    const repositoriesUpdated = repositories.filter(
      repository => repository.id !== id
    );
    setRepositories([...repositoriesUpdated]);
  }

  return (
    <div>
      <h1>Adicionar repositório</h1>
      <form onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="link do repositório"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tecnologias (separadas por vírgula)"
          value={techs}
          onChange={e => setTechs(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul data-testid="repository-list">
        {repositories.map(repository => (
          <li key={repository.id}>
            <a href={repository.url}> {repository.title}</a>
            <span>{repository.techs.map((tech) => (
              <li key={repository.id}>
              {tech}
              </li>
              ))}</span>
            <button
              type="button"
              onClick={() => handleRemoveRepository(repository.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
