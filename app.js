const express = require("express");

const mongoose = require("mongoose");
const Sauce = require("./models/sauce");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();

//express.json pour utilise l'object express.json pour recupere les requetes envoyer par l'user
app.use(express.json());

//systeme de connexion a mango DB
mongoose.connect("mongodb+srv://admin:WaTW7M49WJZk9Nzm@cluster0.v51i2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//donnée l'acces de navigation a toute l'application pour evite les probleme de navigation
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//enregistrement de sauces 
app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

//inscription user
app.post("/api/auth/signup", (req, res, next) => {
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
});

//connexion user
app.post("/api/auth/login", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "utilisateur non trouvé" });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "mot de passe incorrect" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: "TOKEN"
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
});

app.get("api/sauces/:id", (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
});

//recuperation de toute les sauce dans la base de donée 
app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({ error }));
});


module.exports = app;