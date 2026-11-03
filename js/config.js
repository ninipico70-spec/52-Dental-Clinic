const isLocalDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
window.API_BASE = isLocalDevelopment
  ? 'http://localhost:3000/api'
  : 'https://five2-dental-backend.onrender.com/api';
