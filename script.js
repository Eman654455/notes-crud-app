// DOM Elements
const noteForm = document.getElementById('noteForm');
const noteIdInput = document.getElementById('noteId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const notesContainer = document.getElementById('notesContainer');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');

// Initialize notes from LocalStorage or empty array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Event Listeners
noteForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', handleSearch);

// Initial render on page load
renderNotes(notes);

// Function: Handle Form Submit (Create & Update)
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const id = noteIdInput.value;

    // Validation: Check if fields are empty
    if (!title || !description) {
        alert('Please fill in both title and description!');
        return;
    }

    if (id) {
        // Update existing note
        notes = notes.map(note => {
            if (note.id == id) {
                return { ...note, title, description, updatedAt: new Date().toLocaleString() };
            }
            return note;
        });
    } else {
        // Create new note
        const newNote = {
            id: Date.now(),
            title,
            description,
            createdAt: new Date().toLocaleString()
        };
        notes.unshift(newNote); // Add to beginning of array
    }

    // Save to LocalStorage and re-render
    saveToLocalStorage();
    renderNotes(notes);
    resetForm();
}

// Function: Render Notes in UI
function renderNotes(notesArray) {
    notesContainer.innerHTML = '';

    if (notesArray.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    } else {
        emptyMessage.classList.add('hidden');
    }

    notesArray.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        noteCard.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${escapeHTML(note.title)}</h3>
                <p class="note-date">${note.updatedAt ? 'Updated: ' + note.updatedAt : 'Created: ' + note.createdAt}</p>
            </div>
            <div class="note-body">
                <p>${escapeHTML(note.description)}</p>
            </div>
            <div class="note-actions">
                <button class="btn-action btn-edit" onclick="editNote(${note.id})">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="deleteNote(${note.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Function: Edit Note (Load data into form)
function editNote(id) {
    const noteToEdit = notes.find(note => note.id === id);
    if (!noteToEdit) return;

    noteIdInput.value = noteToEdit.id;
    titleInput.value = noteToEdit.title;
    descriptionInput.value = noteToEdit.description;
    
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Note`;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Update Note`;
    cancelBtn.classList.remove('hidden');

    // Scroll to form on mobile/tablet view
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function: Delete Note with confirmation
function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage();
        renderNotes(notes);
        
        if (noteIdInput.value == id) {
            resetForm();
        }
    }
}

// Function: Search / Filter Notes
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.description.toLowerCase().includes(query)
    );
    renderNotes(filteredNotes);
}

// Function: Reset Form State
function resetForm() {
    noteForm.reset();
    noteIdInput.value = '';
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Add New Note`;
    submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Save Note`;
    cancelBtn.classList.add('hidden');
}

// Function: Save to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Utility: Escape HTML for security
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}