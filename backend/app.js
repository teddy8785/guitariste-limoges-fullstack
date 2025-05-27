const express = require("express");
const mongoose = require('mongoose');
const path = require('path');

const guitaristeRoutes = require('./routes/guitaristes');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://teddybarieraud:lXk1Ed5QaWv3CGCn@guitaristes-limoges.ssruxie.mongodb.net/guitaristes-limoges?retryWrites=true&w=majority&appName=guitaristes-limoges',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Tes routes
app.use('/api/guitaristes', guitaristeRoutes);
app.use('/api/user', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/audios', express.static(path.join(__dirname, 'audios')));

module.exports = app;