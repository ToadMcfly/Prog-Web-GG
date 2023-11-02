const Photo = require('../models/photo');
const path = require('path');

// Contrôleur pour afficher le formulaire d'upload de photos
exports.getUploadForm = (req, res) => {
  res.render('upload-form');
};

// Contrôleur pour l'upload de photos
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé.' });
    }

    const { description, motsCles } = req.body;

    // Utilisation du chemin généré par Multer pour stocker dans la base de données
    const cheminFichier = req.file.filename;

    const newPhoto = new Photo({
      description,
      cheminFichier,
      motsCles: motsCles.split(','),
    });

    const savedPhoto = await newPhoto.save(); // Sauvegarde de la nouvelle photo dans la base de données

    return res.status(201).json({ message: 'Photo téléchargée avec succès.', 
    cheminFichier: 'uploads/' + req.file.filename, });
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'upload de la photo.' });
  }
};


// Contrôleur pour la visualisation d'une photo individuelle
exports.getPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo non trouvée.' });
    }

    res.render('detail', { photo }); // Rend la vue detail.pug avec les détails de la photo
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la photo.' });
  }
};

// Contrôleur pour la mise à jour des informations d'une photo
exports.updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { description, motsCles } = req.body;

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo non trouvée.' });
    }

    photo.description = description;
    photo.motsCles = motsCles.split(',');

    const updatedFields = {
       description,
       motsCles
    };

    const result = await Photo.updateOne({ _id: photoId }, { $set: updatedFields });

    if (result.nModified === 0) {
    return res.status(404).json({ message: 'No photo updated. It might not exist or no changes were made.' });
    }

    return res.status(200).json({ message: 'Informations de la photo mises à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la photo :', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo.' });
  }
};

// Contrôleur pour la suppression d'une photo
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo non trouvée.' });
    }

    // Supprime la photo
    await Photo.deleteOne({ _id: photoId })

    // Redirige l'utilisateur vers la page de la galerie après la suppression
    res.redirect('/photos');
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la photo.' });
  }
};


// Contrôleur pour la recherche de photos par mots-clés
exports.searchPhotos = async (req, res) => {
  try {
    const { keyword } = req.query;
    const keywords = keyword.split(',');

    const photos = await Photo.find({ motsCles: { $in: keywords } });

    return res.status(200).json(photos);
  } catch (error) {
    console.error('Erreur lors de la recherche de photos :', error);
    return res.status(500).json({ message: 'Erreur lors de la recherche de photos.' });
  }
};

//Contrôleur pour la recherche de photo par ID
exports.getPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo non trouvée.' });
    }

    res.render('detail', { photo });
  } catch (error) {
    console.error('Erreur lors de la récupération de la photo :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de la photo.' });
  }
};

// Contrôleur pour afficher la galerie de photos
exports.getGallery = async (req, res) => {
  try {
    // Logique pour récupérer les photos à afficher dans la galerie
    const photos = await Photo.find();
    console.log(photos);  

    // Rendre la vue de la galerie avec les données des photos
    res.render('galerie', { photos });
  } catch (error) {
    console.error('Erreur lors de la récupération des photos pour la galerie :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des photos pour la galerie.' });
  }
};