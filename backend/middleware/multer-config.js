const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (file.mimetype.startsWith("image/")) {
      return {
        folder: "guitaristes/images",
        resource_type: "image",
      };
    }

    if (file.mimetype.startsWith("audio/")) {
      return {
        folder: "guitaristes/audio",
        resource_type: "video", // IMPORTANT pour audio Cloudinary
      };
    }

    return {
      folder: "guitaristes/other",
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
