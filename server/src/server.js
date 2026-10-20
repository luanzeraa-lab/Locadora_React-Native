const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User, Content } = require('./models');
const { createToken, authRequired } = require('./auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

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
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

const port = 3333;
async function start() {
  await mongoose.connect(
    'mongodb+srv://luan:minhanovasenha@cluster0.5ozoan9.mongodb.net/technologic'
    , { tls: true }
  );
  app.listen(port, '0.0.0.0', () => console.log(`API disponível em http://localhost:${port}`));
}

if (require.main === module) start().catch((error) => {
  console.error('Não foi possível conectar ao MongoDB:', error.message);
  process.exitCode = 1;
});

module.exports = app;
