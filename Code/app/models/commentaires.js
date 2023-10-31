const mongoose = require('mongoose');

const commentaireSchema = new mongoose.Schema({
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true,
  },
  contenu: {
    type: String,
    required: true,
  },
  datePublication: {
    type: Date,
    default: Date.now,
  },
});

const Commentaire = mongoose.model('Commentaire', commentaireSchema);

module.exports = Commentaire;