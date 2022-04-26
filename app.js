const express = require("express");

const mongoose = require("mongoose");
const Sauce = require("./models/sauce");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();


app.use(express.json());

mongoose.connect("mongodb+srv://admin:WaTW7M49WJZk9Nzm@cluster0.v51i2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

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

})

module.exports = app;