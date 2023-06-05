const express = require('express')
const SongBookController = require('../controllers/SongBookController')

// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', SongBookController.songBookList)
router.post('/', SongBookController.songBookStore)
router.put('/:id', SongBookController.songBookUpdate)
router.delete('/:id', SongBookController.songBookDelete)

module.exports = router
