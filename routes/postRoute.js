const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/post', postController.getAll);
router.get('/post/:id', postController.getById);
router.post('/post', postController.createPost);
router.put('/post/:id', postController.putById);

module.exports = router;