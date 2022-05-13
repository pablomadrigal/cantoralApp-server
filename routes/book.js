const express = require('express');
const BookController = require('../controllers/BookController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', BookController.bookList);
router.get('/:id', BookController.bookDetail);
router.post('/', BookController.bookStore);
router.put('/:id', BookController.bookUpdate);
router.delete('/:id', BookController.bookDelete);

module.exports = router;
