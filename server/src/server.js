const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();
const { User, Content } = require('./models');
const { createToken, authRequired } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
const uploadsDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const isAllowedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (isAllowedType || allowedExtensions.includes(extension)) {
      return callback(null, true);
    }
    return callback(new Error('Envie uma imagem JPG, PNG ou WebP. Tipo recebido: ' + (file.mimetype || 'desconhecido')));
  },
});
app.use('/uploads', express.static(uploadsDirectory));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'technologic-api' }));

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: 'Nome, e-mail e senha de 6 caracteres são obrigatórios.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    });
    return res.status(201).json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
    return res.json({
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/auth/me', authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado.' });
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/uploads/image', authRequired, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Selecione uma imagem JPG, PNG ou WebP.' });
  return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
});

app.put('/api/auth/me', authRequired, async (req, res, next) => {
  try {
    const updates = {};
    if (typeof req.body.name === 'string' && req.body.name.trim()) updates.name = req.body.name.trim();
    if (typeof req.body.avatar === 'string') updates.avatar = req.body.avatar;
    if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/contents', async (req, res, next) => {
  try {
    const filter = req.query.search
      ? { $or: [{ title: new RegExp(req.query.search, 'i') }, { subtitle: new RegExp(req.query.search, 'i') }] }
      : {};
    return res.json(await Content.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    return next(error);
  }
});

app.post('/api/contents', authRequired, async (req, res, next) => {
  try {
    const { title, subtitle, imageUrl, description, category } = req.body;
    if (!title?.trim() || !subtitle?.trim() || !imageUrl?.trim()) {
      return res.status(400).json({ message: 'Título, subtítulo e URL da imagem são obrigatórios.' });
    }
    return res.status(201).json(await Content.create({
      title: title.trim(), subtitle: subtitle.trim(), imageUrl: imageUrl.trim(),
      description: description?.trim() || '', category: category?.trim() || 'Séries', createdBy: req.user.id,
    }));
  } catch (error) {
    return next(error);
  }
});

app.put('/api/contents/:id', authRequired, async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!content) return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    return res.json(content);
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/contents/:id', authRequired, async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof multer.MulterError || error.message?.startsWith('Envie uma imagem')) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

const port = 3333;
async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI não definida. Configure a variável em server/.env.');
  }
  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);
  if (dnsServers.length) dns.setServers(dnsServers);
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  app.listen(port, '0.0.0.0', () => console.log(`API disponível em http://localhost:${port}`));
}

if (require.main === module) start().catch((error) => {
  console.error('Não foi possível conectar ao MongoDB:', error.message);
  process.exitCode = 1;
});

module.exports = app;
