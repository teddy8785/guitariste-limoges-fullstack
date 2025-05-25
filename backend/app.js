const express = require ("express");
const mongoose = require('mongoose');

const guitaristeRoutes = require('./routes/guitaristes');

const app = express();

mongoose.connect('mongodb+srv://teddybarieraud:lXk1Ed5QaWv3CGCn@guitaristes-limoges.ssruxie.mongodb.net/guitaristes-limoges?retryWrites=true&w=majority&appName=guitaristes-limoges',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/guitaristes', guitaristeRoutes);
// app.use('/api/auth', userRoutes);
// app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;