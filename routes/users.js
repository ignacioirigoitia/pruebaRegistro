/* VARIABLES */
var express = require('express');
var router = express.Router();

const {register, processRegister, login, processLogin, profile} = require('../controllers/usersController')

/* MIDDLEWARES */
const uploadImages = require("../middlewares/uploadImages");                                /* PRIMERO VAN LOS MIDDLEWARES Y LUEGO LOS VALIDADORES */

/* VALIDADORES */
const registerValidator = require("../validations/registerValidator")

router.get('/register', register);
router.post('/register', uploadImages.any(), registerValidator, processRegister);

router.get('/login', login);
router.post('/login', processLogin)

router.get("/profile", profile);

module.exports = router;