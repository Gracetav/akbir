module.exports = (role) => {
    return (req, res, next) => {
        if (req.session && req.session.role === role) {
            return next();
        }
        return res.status(403).send('Akses dilarang (Forbidden)');
    };
};
