const express = require('express');
const router = express.Router();
const guitaristeCtrl = require('../controllers/guitaristes');

router.post('/', guitaristeCtrl.createGuitariste);
router.get('/', guitaristeCtrl.getAllGuitaristes);

module.exports = router;