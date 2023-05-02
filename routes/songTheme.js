const express = require('express')
const SongThemeController = require('../controllers/SongThemeController')

// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', SongThemeController.songThemeList)
router.post('/', SongThemeController.songThemeCreate)
router.delete('/:id', SongThemeController.songThemeDelete)

module.exports = router
