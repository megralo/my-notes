import React, { useState } from 'react';
import './NoteApp.css';

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form submitted', { inputText, title }); // Debug log

    if (!inputText.trim() || !title.trim()) {
      alert('Inserisci sia il titolo che il contenuto della nota');
      return;
    }

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


  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };


  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Inserisci sia il titolo che il contenuto della nota');
      return;
    }

    setNotes(notes.map(note =>
      note.id === editingNoteId
        ? {
          ...note,
          title: editTitle.trim(),
          content: editContent.trim(),
          date: new Date().toISOString()
        }
        : note
    ));

    setEditingNoteId(null);
    setEditTitle('');
    setEditContent('');
  };

  
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditContent('');
  };


  return (
    <div className="note-app">
      <div className="import-export-buttons">
        <span className="note-counter">Note totali: {notes.length}</span>

        <button onClick={exportNotes} className="export-button">
          Esporta
        </button>

        <label className="import-button">
          Importa
          <input
            type="file"
            accept=".json"
            onChange={importNotes}
            style={{ display: 'none' }}
          />
        </label>
      </div>


      <div className="note-input">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo della nota..."
            className="title-input"
          />
          <textarea
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Scrivi una nota..."
            className="content-input"
            rows={10}
          />
          <button type="submit" className="add-button">
            Aggiungi Nota
          </button>
        </form>
      </div>


      <div className="notes-list">
        {notes
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(note => (
            <div key={note.id} className="note-card">
              {editingNoteId === note.id ? (
                // Modalità modifica
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-title-input"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="edit-content-input"
                    rows={5}
                  />
                  <div className="edit-buttons">
                    <button onClick={handleSaveEdit} className="save-button">
                      Salva
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      Annulla
                    </button>
                  </div>
                </div>
              ) : (
                // Modalità visualizzazione
                <>
                  <div className="note-header">
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-buttons">
                      <button
                        onClick={() => handleEdit(note)}
                        className="edit-button"
                      >
                        &#9998;
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="delete-button"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="note-date">
                    {new Date(note.date).toLocaleString('it-IT')}
                  </p>
                  <p className="note-content">{note.content}</p>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default NoteApp;