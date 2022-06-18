const express = require("express");
const controllerUser = require("../controllers/controller_user");
const router = express.Router();

router.post("/signup", controllerUser.createUser);
router.post("/login", controllerUser.connexionUser);




module.exports = router;