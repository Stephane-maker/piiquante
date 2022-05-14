const express = require('express');
const controllerSauce = require("../controllers/controller_sauce");


const router = express.Router();

router.post('/', controllerSauce.createSauce);
router.get("/:id", controllerSauce.selectOneSauce);
router.get('/', controllerSauce.selectAllSauce);

module.exports = router;