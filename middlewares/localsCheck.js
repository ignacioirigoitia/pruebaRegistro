module.exports = (req, res, next) => {
    if(req.session.user){
        res.locals.user = req.session.user
    }
    next();
};

// SI ESTA LEVANTADA SESSION, GUARDO EN RES.LOCALS.USER LO QUE ESTA EN REQ.SESSION.USER