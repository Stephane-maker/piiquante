const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
let test = [0];

require("dotenv").config()

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                essaye: 0
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur crée!' }))
        })

    .catch((error) => res.status(400).json({ error }));
}


exports.connexionUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json("Your account has been unlocked")
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jsonWebToken.sign({ userId: user._id },
                            process.env.SECRET_TOKEN, { expiresIn: '24h' }
                        )
                    });

                })

        })

};