const express = require('express');
const router = express.Router();
const guitaristeCtrl = require('../controllers/guitaristes');
const { updateMyGuitariste } = require('../controllers/guitaristes');
const { deleteMyGuitariste } = require('../controllers/guitaristes');
const auth = require('../middleware/auth');

router.post('/', auth, guitaristeCtrl.createGuitariste);
router.get('/', guitaristeCtrl.getAllGuitaristes);
router.get('/me', auth, guitaristeCtrl.getMyGuitariste);
router.get('/:id', guitaristeCtrl.getGuitaristeById);
router.put('/me', auth, updateMyGuitariste);
router.delete('/me', auth, deleteMyGuitariste);

module.exports = router;