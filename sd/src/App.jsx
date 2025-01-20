import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Por favor, insira o nome de um artista.');
      return;
    }

    try {
      // Buscar artista no MusicBrainz
      const response = await fetch(
        https://musicbrainz.org/ws/2/artist/?query=artist:${searchQuery}&fmt=json
      );
      const data = await response.json();

      if (data.artists.length === 0) {
        setError('Artista não encontrado. Tente outro nome.');
        setArtistData(null);
        return;
      }

      const artist = data.artists[0];

      // Obter relações de URL do artista
      const artistResponse = await fetch(
        https://musicbrainz.org/ws/2/artist/${artist.id}?inc=url-rels&fmt=json
      );
      const artistDetails = await artistResponse.json();

      // Inicializar dados adicionais
      let imageUrl = '';
      let biography = '';
      let genre = artist.gender || 'Não disponível';
      let birthDate = artist['life-span'].begin || 'Não disponível';
      let deathDate = artist['life-span'].end || null;

      // Verificar relações de URL
      if (artistDetails.relations) {
        for (const rel of artistDetails.relations) {
          if (rel.type === 'wikidata') {
            // Obter imagem do Wikidata
            const wikidataId = rel.url.resource.split('/').pop();
            const wikidataResponse = await fetch(
              https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json
            );
            const wikidataData = await wikidataResponse.json();
            const entity = wikidataData.entities[wikidataId];
            if (entity && entity.claims && entity.claims.P18) {
              const imageName = entity.claims.P18[0].mainsnak.datavalue.value;
              imageUrl = https://commons.wikimedia.org/wiki/Special:FilePath/${imageName};
            }
          } else if (rel.type === 'wikipedia') {
            // Obter biografia da Wikipedia em português
            const wikiTitle = rel.url.resource.split('/').pop();
            const wikipediaResponse = await fetch(
              https://pt.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}
            );
            const wikipediaData = await wikipediaResponse.json();
            if (wikipediaData.extract) {
              biography = wikipediaData.extract;
            }
          }
        }
      }

      // Traduzir ou ajustar gênero e data de nascimento
      genre = genre === 'male' ? 'Masculino' : genre === 'female' ? 'Feminino' : genre;
      birthDate = birthDate === 'Não disponível' ? 'Data de nascimento não disponível' : birthDate;
      deathDate = deathDate ? Data de falecimento: ${deathDate} : null;

      // Atualizar estado com dados do artista
      setArtistData({
        name: artist.name,
        gender: genre,
        birthDate: birthDate,
        deathDate: deathDate,
        biography: biography || 'Biografia não disponível.',
        imageUrl: imageUrl || 'Imagem não disponível.',
      });
      setError('');
    } catch (err) {
      setError('Erro ao buscar informações do artista.');
      setArtistData(null);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Informações do Artista</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Digite o nome do artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Buscar</button>
        </div>
        {error && <p className="error">{error}</p>}
      </header>

      {artistData && (
        <main>
          <div className="artist-info">
            <h2>{artistData.name}</h2>
            <div className="image-container">
              {artistData.imageUrl !== 'Imagem não disponível.' ? (
                <img
                  src={artistData.imageUrl}
                  alt={Imagem de ${artistData.name}}
                  className="artist-image"
                />
              ) : (
                <p>{artistData.imageUrl}</p>
              )}
            </div>
            <p><strong>Gênero:</strong> {artistData.gender}</p>
            <p><strong>Data de Nascimento:</strong> {artistData.birthDate}</p>
            {artistData.deathDate && <p><strong>{artistData.deathDate}</strong></p>}
            <p><strong>Biografia:</strong> {artistData.biography}</p>
          </div>
        </main>
      )}
    </div>
  );
};

export default App