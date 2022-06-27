const jsonWebToken = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsonWebToken.verify(token, process.env.SECRET_TOKEN + process.env.ALGORITHM);
        const userId = decodedToken.userId;

        req.auth = { userId };

        if (req.body.userId && req.body.userId !== userId) {

            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};