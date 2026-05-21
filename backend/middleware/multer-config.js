const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "audio/mpeg",
    "audio/mp3",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype.startsWith("image/")) {
      return {
        folder: "guitaristes/images",
        resource_type: "image",
      };
    }

    if (file.mimetype.startsWith("audio/")) {
      return {
        folder: "guitaristes/audio",
        resource_type: "video",
      };
    }

    return {
      folder: "guitaristes/other",
      resource_type: "auto",
    };
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
