// Tiny static file server for the frontend (no dependencies).
const http = require('http'), fs = require('fs'), path = require('path');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const port = process.env.PORT || 5173;
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const file = path.join(__dirname, path.normalize(p));
  if (!file.startsWith(__dirname) || file.endsWith('server.js') || file.endsWith('package.json')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (e, d) => e ? (res.writeHead(404), res.end('Not found')) : (res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }), res.end(d)));
}).listen(port, () => console.log(`52-Dental Clinic frontend at http://localhost:${port}`));
