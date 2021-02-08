/* VARIABLES */
var express = require('express');
var router = express.Router();

const {register, processRegister, login, processLogin, profile, fatality, eliminar} = require('../controllers/usersController');


/* MIDDLEWARES */
const uploadImages = require("../middlewares/uploadImages");                                /* PRIMERO VAN LOS MIDDLEWARES Y LUEGO LOS VALIDADORES */
const checkUser = require("../middlewares/checkUser");

/* VALIDADORES */
const registerValidator = require("../validations/registerValidator")

router.get('/register', register);
router.post('/register', uploadImages.any(), registerValidator, processRegister);

router.get('/login', login);
router.post('/login', processLogin);

router.get("/profile", checkUser, profile);
router.delete("/delete/:id", eliminar);

router.get("/logout", fatality);

module.exports = router;