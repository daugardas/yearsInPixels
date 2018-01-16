function loggedOut(req, res, next){
    if(req.session && req.session.userId){
        return res.redirect('/');
    }
    return next();
}
function loggedIn(req, res, next){
    if(req.session && req.session.userId){
        return next();
    }
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
}
module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;