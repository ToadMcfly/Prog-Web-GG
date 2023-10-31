const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://toad:GWg060wRs2zdbXEl@cluster0.m03casc.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Gestion des erreurs de connexion à la base de données
mongoose.connection.on('connected', () => {
  console.log('Connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB :', err);
});

// Configuration serveur Express

app.listen(PORT, () => {
  console.log(`Le serveur Express est en cours d'exécution sur le port ${PORT}`);
});

// Configuration Pug comme moteur de modèle
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app/views')); // Assurez-vous que le chemin des vues est correct

// Définir la route de la galerie comme page d'accueil
app.get('/', (req, res) => {
  // Rediriger vers la page de la galerie
  res.redirect('/photos');
});

//Route pour le formulaire d'upload
app.get('/upload', (req, res) => {
  res.render('upload');
});

// Importation des routes
const photoRoutes = require('./routes/routePhoto');
const commentaireRoutes = require('./routes/routeCommentaires'); 

// Configuration des routes sur des chemins d'URL appropriés
app.use('/photos', photoRoutes);
app.use('/comments', commentaireRoutes);

app.use((req, res, next) => {
  res.status(404).send("Page introuvable");
});

app.use(express.static(path.join(__dirname, 'public')));