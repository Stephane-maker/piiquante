const express = require("express");

const mongoose = require("mongoose");
const Sauce = require("./models/sauce");
const app = express();


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

app.use("/api/sauces", (req, res, next) => {
    const sauces = [{
        name: "Sauce bechamel",
        manufacturer: "Thiebaut Stephane",
        description: "Découvrez la recette de la Sauce Béchamel, un classique de la cuisine française, qui sert de base à de nombreuses préparations comme les endives au jambon, les lasagnes ou de savoureux croque-monsieur",
        mainPepper: "Noix de muscade",
        imageUrl: "https://img-3.journaldesfemmes.fr/1PlGF-0oQSYQs_S_nmcXmkjKjfo=/750x500/smart/91f0c055db7e4e9f9025d106bba4ed40/recipe-jdf/10002052.jpg",
        heat: "4 personnes",
    }];
    res.status(201).json(sauces);
});
app.post('/api/stuff', (req, res, next) => {

    const sauce = new Sauce({
        ...req.body
    });
    console.log(sauce)
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;