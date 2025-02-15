import React, { useState } from 'react';
import './NoteApp.css';

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !title.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: inputText.trim(),
      date: new Date().toISOString()
    };

    setNotes([...notes, newNote]);
    setInputText('');
    setTitle('');
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importNotes = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedNotes = JSON.parse(e.target.result);
          setNotes(importedNotes);
        } catch (error) {
          alert('Errore nel caricamento del file JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="note-app">
      <div className="note-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo della nota..."
            className="title-input"
          />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Scrivi una nota..."
            className="content-input"
          />
          <button type="submit" className="add-button">
            Aggiungi Nota
          </button>
        </form>
      </div>

      <div className="import-export-buttons">
        <button onClick={exportNotes} className="export-button">
          Esporta Note
        </button>
        <label className="import-button">
          Importa Note
          <input
            type="file"
            accept=".json"
            onChange={importNotes}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <button 
                onClick={() => deleteNote(note.id)} 
                className="delete-button"
              >
                ×
              </button>
            </div>
            <p className="note-date">
              {new Date(note.date).toLocaleString('it-IT')}
            </p>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteApp;