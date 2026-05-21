const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  (req, res) => {
    res.json({
      image: req.files?.image?.[0]?.path,
      audio: req.files?.audio?.[0]?.path,
    });
  },
);

module.exports = router;
