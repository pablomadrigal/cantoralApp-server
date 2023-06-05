const express = require('express')
const AuthorTypeController = require('../controllers/AuthorTypeController')

// eslint-disable-next-line new-cap
const router = express.Router()

router.get('/', AuthorTypeController.authorTypeList)
router.post('/', AuthorTypeController.authorTypeCreate)
router.delete('/:id', AuthorTypeController.authorTypeDelete)

module.exports = router
