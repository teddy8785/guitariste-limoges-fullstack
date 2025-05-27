const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Autoriser image et audio (si tu veux gérer audios aussi)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;