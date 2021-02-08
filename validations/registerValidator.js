const fs = require("fs");
const {check, body} = require("express-validator");
const users_db = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));


module.exports = [
    /* chequeo que el username no este vacio */
    check("username").notEmpty().withMessage("El username es requerido"),

    /* chequeo que el mail sea mail */
    check("email").isEmail().withMessage("Debe ser un email valido"),

    /* chequeo que el mail no este registrado */
    body("email").custom(value => {
        let result = users_db.find(user => user.email === value)

        if(result){
            return false
        }else{
            return true
        }
    }).withMessage("El email esta registrado"), 

    /* chequeo que la contraseña sea minimo 6 y maximo 12 */
    check("pass").isLength({min: 6, max: 12}).withMessage("Minimo 6 y maximo 12"),

    /* hago un body de pass2 para verificar que sea igual a la pass */
    body("pass2").custom((value, {req}) => {
        if(value != req.body.pass){
            return false
        }else{
            return true
        }
    }).withMessage("Las contraseñas no coinciden")
];