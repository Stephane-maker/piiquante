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
                        let result = JSON.parse(test) + 1;
                        test = result

                        if (test >= 4) {
                            result = 0
                            console.log("ici")
                            test = 4;
                            console.log(test);
                            !bcrypt.compare(req.body.password, user.password)

                            const heure = new Date();
                            let minuteTest = heure.getMinutes() + 1;
                            console.log(minuteTest)
                            console.log(heure.getMinutes() >= minuteTest)
                            if (!minuteTest >= heure.getMinutes()) {

                                test = [0];
                                bcrypt.compare(req.body.password, user.password)
                                console.log(test)
                            }
                            return res.status(401).json("Your account has been unlocked")

                        }
                        return res.status(501).json({ error: "Your account has been blocked for 1 minute" });




                    }

                    if (valid && test != 4) {
                        bcrypt.compare(req.body.password, user.password)
                        res.status(200).json({
                            userId: user._id,
                            token: jsonWebToken.sign({ userId: user._id },
                                process.env.SECRET_TOKEN, { expiresIn: '24h' }
                            )
                        });
                    }
                })

        })

};