const fs = require("fs");
const path = require("path")
const users_db = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

module.exports = {
    register: (req, res) => {
        res.render('register')
    },
    processRegister: (req, res) => {

        /* me traigo los errores */
        let errores = validationResult(req);
        

        /* si hay errores envio los errores al ejs */
        if (!errores.isEmpty()) {
            return res.render("register", {
                errores: errores.errors
            });
        } else {

            /* me traigo los datos del form */
            const { username, email, pass } = req.body;

            /* encuentro el ultimo ID */
            let lastID = 0;
            users_db.forEach(user => {
                if (user.id > lastID) {
                    lastID = user.id
                }
            });

            /* hasseo la contraseña */
            let hashPass = bcrypt.hashSync(pass, 12)

            /* creo el nuevo usuario con el id y los datos del form */
            let newUser = {
                id: +lastID + 1,
                username,
                email,
                pass: hashPass,
                avatar: req.files[0].filename
            };

            /* pusheo la base y la reemplazo por la actual con el usuario nuevo */
            users_db.push(newUser);
            fs.writeFileSync("./data/users.json", JSON.stringify(users_db, null, 2));

            /* redirigo a otra pagina */
            return res.redirect("/users/login");
        }
    },
    login: (req, res) => {
        res.render('login')
    },
    processLogin: (req, res) => {
        
        /* me traigo los errores */
        let errores = validationResult(req);

        /* si hay errores envio los errores al ejs */
        if(!errores.isEmpty()){
            res.render("login", {
                errores: errores.errors
            });
        } else {

            /* me traigo los datos del form */
            const {email, pass, recordar} = req.body;

            /* verifico que el email este en la base de datos */
            let result = users_db.find(user => user.email === email);

            /* verifico que la contraseña sea la misma y si es positivo redirigo al perfil */
            if(result){
                if (bcrypt.compareSync(pass.trim(), result.pass)) {

                    //guardo en el objeto session.user los datos del usuario para levantar session del usuario
                    req.session.user = {
                        id: result.id,
                        username: result.username,
                        avatar: result.avatar
                    }

                    // creo la cookie para cuando el usuario elija recordarme
                    if(recordar != "undefined"){
                        res.cookie("userCom4", req.session.user, {maxAge: 1000 * 60 * 60 * 24}); // 1 dia de recordar la cookie
                    }

                    return res.redirect("/users/profile");
                }
            }

            /* retorno al ejs los errores */
            return res.render("login", {
                errores: [
                    {
                        msg: "Credenciales invalidas"
                    }
                ]
            });
        };
    },
    profile: (req, res) =>{
        res.render("profile")
    },
    fatality: (req, res) => {

        //cuando cierro sesion, mato el req.session
        req.session.destroy();

        //cuando finalizo la session, tambien me encargo de matar la cookie
        if(req.cookies.userCom4){
            res.cookie("userCom4", "", {maxAge: -1})
        };

        //finalizo redireccionando
        res.redirect("/");
    },
    eliminar: (req, res) => {

        


    }
};
