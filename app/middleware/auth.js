const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: -100, message: "Token is invalid. Redirecting to login." })
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: -100, message: "Token expired. Redirecting to login." })
        req.user = user
        next()
    });
}

module.exports = auth