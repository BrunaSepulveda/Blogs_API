const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/user', userController.user);
router.get('/user', userController.getAll);
router.get('/user/:id', userController.getById);

module.exports = router;