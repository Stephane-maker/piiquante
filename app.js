const express = require("express");

const mongoose = require("mongoose");
const path = require("path");


const connexionUser = require("./router_connexion/connexion_user");
const routerSauce = require("./router_sauce/router_sauce");

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

app.use("/image", express.static(path.join(__dirname, "image")));

app.use("/api/auth", connexionUser);
app.use("/api/sauces", routerSauce);

module.exports = app;