const { useState, useEffect, useCallback } = React;

const API_BASE_URL = 'http://localhost:3000';

// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Main App Component
function App() {
  const [route, setRoute] = useState('home'); // 'home', 'login', 'note'
  const [user, setUser] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to verify the token with the backend here
      // For simplicity, we'll just assume it's valid if it exists
      api.get('/api/users/me')
        .then(response => {
          setUser(response.data);
          setRoute('home');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setRoute('login');
        });
    } else {
      setRoute('login');
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setRoute('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRoute('login');
  };

  const navigateToNote = (noteId) => {
    setSelectedNoteId(noteId);
    setRoute('note');
  };

  const navigateToHome = () => {
    setSelectedNoteId(null);
    setRoute('home');
  };

  const renderPage = () => {
    if (route === 'login') {
      return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }
    if (route === 'home' && user) {
      return <HomePage user={user} onLogout={handleLogout} onSelectNote={navigateToNote} />;
    }
    if (route === 'note' && user) {
      return <NoteDetailPage noteId={selectedNoteId} onBack={navigateToHome} />;
    }
    return <div className="text-center p-8">Loading...</div>;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {renderPage()}
    </div>
  );
}

// Auth Page Component
function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const response = await api.post(url, { username, password });
      if (isLogin) {
        onLoginSuccess(response.data.user, response.data.token);
      } else {
        // Automatically log in after successful registration
        const loginResponse = await api.post('/api/auth/login', { username, password });
        onLoginSuccess(loginResponse.data.user, loginResponse.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-4">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

// Home Page Component
function HomePage({ user, onLogout, onSelectNote }) {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await api.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteCreated = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hi, {user.username}</h1>
        <div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600">
            Create Note
          </button>
          <button onClick={onLogout} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
            Logout
          </button>
        </div>
      </header>

      <div className="masonry-grid">
        {notes.map(note => (
          <div key={note.id} className="masonry-item bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={() => onSelectNote(note.id)}>
            {note.imageUrl && <img src={`${API_BASE_URL}${note.imageUrl}`} alt={note.title} className="w-full h-auto object-cover"/>}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-700 text-sm">{note.content.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CreateNoteModal
          onClose={() => setIsModalOpen(false)}
          onNoteCreated={handleNoteCreated}
        />
      )}
    </div>
  );
}

// Create Note Modal Component
function CreateNoteModal({ onClose, onNoteCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await api.post('/api/notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onNoteCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full m-4">
        <h2 className="text-2xl font-bold mb-4">Create New Note</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 mb-2">Content</label>
            <textarea id="content" value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows="4"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2">Image</label>
            <input type="file" id="image" onChange={handleImageChange} className="w-full" accept="image/*" />
          </div>
          {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg mr-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Note Detail Page Component
function NoteDetailPage({ noteId, onBack }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/notes/${noteId}`);
        setNote(response.data);
      } catch (err) {
        setError('Failed to fetch note details.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (loading) return <div className="text-center p-8">Loading note...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!note) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded-lg mb-8 hover:bg-gray-300">
        &larr; Back to Home
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {note.imageUrl && <img src={`${API_BASE_URL}${note.imageUrl}`} alt={note.title} className="w-full h-96 object-cover" />}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
          <p className="text-gray-600 mb-2">By {note.author.username}</p>
          <p className="text-gray-500 text-sm mb-6">Posted on {new Date(note.createdAt).toLocaleDateString()}</p>
          <div className="prose max-w-none">
            {note.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}


// Render the app
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
