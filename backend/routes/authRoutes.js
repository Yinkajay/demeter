const express = require('express')
const { signup, login, getProfileData, editProfileData } = require('../controllers/authController')
const verifyToken = require('../middleware/verifyToken')
const router = express.Router()

router
    .post('/signup', signup)
    .post('/login', login)
    .get('/profile', verifyToken, getProfileData)
    .patch('/profile', verifyToken, editProfileData)


module.exports = router