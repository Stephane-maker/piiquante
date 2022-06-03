const express = require('express');
const controllerSauce = require("../controllers/controller_sauce");
const authenticateToken = require("../middleware/auth_token");
const multer = require("../middleware/multer_config");


const router = express.Router();

router.post('/', authenticateToken, multer, controllerSauce.createSauce);
router.get("/:id", authenticateToken, controllerSauce.selectOneSauce);
router.get('/', authenticateToken, controllerSauce.selectAllSauce);
router.put('/:id', authenticateToken, controllerSauce.modifySauce);
router.delete("/:id", authenticateToken, controllerSauce.deleteSauce);
router.post("/:id/like", authenticateToken, controllerSauce.likedSauce);
router.post("/:id/dislike", authenticateToken, controllerSauce.disLikeSauce);
module.exports = router;