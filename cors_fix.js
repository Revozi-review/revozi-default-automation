const cors = require('cors');

app.use(cors({
  origin: [
    'https://default-automation-fe-1ggw.vercel.app',
    'https://default-automation-fe.vercel.app',
    'http://localhost:3000',
    'http://localhost:8000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
