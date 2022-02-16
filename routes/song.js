var express = require("express");
const SongController = require("../controllers/SongController");

var router = express.Router();

router.get("/", SongController.songList);
router.get("/:id", SongController.songDetail);
router.post("/", SongController.songStore);
router.put("/:id", SongController.bookUpdate);
//router.delete("/:id", SongController.bookDelete);

module.exports = router;
