const Commentaire = require('../../app/models/commentaires');

// Contrôleur pour l'ajout de commentaires
exports.addComment = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { contenu } = req.body;

    const newComment = new Commentaire({
      photo: photoId,
      contenu,
      datePublication: new Date(),
    });

    await newComment.save();

    return res.status(201).json({ message: 'Commentaire ajouté avec succès.' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
    return res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire.' });
  }
};

// Contrôleur pour la suppression d'un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Commentaire.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé.' });
    }

    await comment.remove();

    return res.status(200).json({ message: 'Commentaire supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression du commentaire.' });
  }
};