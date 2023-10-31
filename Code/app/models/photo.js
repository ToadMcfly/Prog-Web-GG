const express = require('express');
const router = express.Router();
const multer = require('multer');
const photoController = require('../controllers/photoController');
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  cheminFichier: {
    type: String,
    required: true,
  },
  motsCles: {
    type: [String],
    required: true,
  },
  datePublication: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;