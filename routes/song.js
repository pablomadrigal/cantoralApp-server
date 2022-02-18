const express = require('express');
const SongController = require('../controllers/SongController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', SongController.songList);
router.get('/light/active', SongController.songListLightActive);
router.get('/light', SongController.songListLightNotDelete);
router.get('/:id', SongController.songDetail);
router.post('/', SongController.songStore);
router.put('/:id', SongController.songUpdate);
// router.delete("/:id", SongController.bookDelete);

module.exports = router;
