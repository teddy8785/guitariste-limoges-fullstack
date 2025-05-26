const express = require('express');
const router = express.Router();
const guitaristeCtrl = require('../controllers/guitaristes');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // middleware Multer

// POST avec auth + upload image
router.post('/', auth, multer, guitaristeCtrl.createGuitariste);

router.get('/', guitaristeCtrl.getAllGuitaristes);
router.get('/me', auth, guitaristeCtrl.getMyGuitariste);
router.get('/:id', guitaristeCtrl.getGuitaristeById);
router.put('/me', auth, multer, guitaristeCtrl.updateMyGuitariste);
router.delete('/me', auth, guitaristeCtrl.deleteMyGuitariste);

module.exports = router;