const express = require('express');
const AuthorController = require('../controllers/AuthorController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', AuthorController.authorList);
router.get('/:id', AuthorController.authorDetail);
router.post('/', AuthorController.authorStore);
router.put('/:id', AuthorController.authorUpdate);
router.delete('/:id', AuthorController.authorDelete);

module.exports = router;
