function isAuth() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ message: 'Please log in' });
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.status(400).json({ message: 'You are already signed in' });
        }
    };
}

function isOwner() {
    return (req, res, next) => {
        if (req.user && req.user._id == res.locals.item.owner) {
            next();
        } else {
            next();
            res.status(403).json({ message: 'You cannot modify this record' });
        }
    };
}

function isAuthorized () { 
    return (req, res, next) => {
        if (req.user && req.user.autorization == "Admin") {
            next();
        } else {
            res.status(403).json({ message: 'You are not authorized to do that!' });
        }
    };
}

module.exports = {
    isAuth,
    isGuest,
    isOwner,
    isAuthorized
};
