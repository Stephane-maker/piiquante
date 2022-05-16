const express = require('express');
const controllerSauce = require("../controllers/controller_sauce");
const authenticateToken = require("../middleware/auth_token");
const multer = require("../middleware/multer_config")

const router = express.Router();

router.post('/', authenticateToken, multer, controllerSauce.createSauce);
router.get("/:id", authenticateToken, controllerSauce.selectOneSauce);
router.get('/', authenticateToken, controllerSauce.selectAllSauce);

module.exports = router;