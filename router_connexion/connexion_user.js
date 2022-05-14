const express = require("express");
const controllerUser = require("../controllers/controller_user");
const router = express.Router();

//connexion user
router.post("/login", controllerUser.connexionUser);

//inscription user
router.post("/signup", controllerUser.createUser);

module.exports = router;