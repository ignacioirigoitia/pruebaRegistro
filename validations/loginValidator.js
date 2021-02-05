const {check} = require("express-validator");

module.exports = [
    
    /* chequeo que el mail sea mail */
    check("email").isEmail().withMessage("Debe ser un email valido"),

    /* chequeo que la contraseña no este vacia */
    check("pass").notEmpty().withMessage("La contraseña es requerida"),

];