const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
require("dotenv").config()

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save();
        })
        .then(() => res.status(201).json({ message: 'utilisateur crée!' }))
        .catch(error => res.status(400).json({ error }));
}
exports.connexionUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(utilisateur => {
            if (!utilisateur) {
                return res.status(401).json({ error: "utilisateur non trouvé" });
            }
            bcrypt.compare(req.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "mot de passe incorrect" });
                    }
                    res.status(200).json({
                        UserId: utilisateur._id,
                        token: jsonWebToken.sign({ UserId: utilisateur._id },
                            process.env.SECRET_TOKEN, { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};