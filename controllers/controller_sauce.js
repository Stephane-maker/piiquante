const Sauce = require("../models/sauce");
const fs = require("fs");
const jsonWebToken = require("jsonwebtoken");
const sauce = require("../models/sauce");
require("dotenv").config()



exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce)
    delete SauceObject._id

    SauceObject._id = jsonWebToken.sign({ objectId: req.auth.userId }, process.env.SECRET_TOKEN);

    const sauce = new Sauce({
        ...SauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.selectOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.selectAllSauce = (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({ error }));
};
exports.modifySauce = (req, res, next) => {
    const idObject = req.params.id;
    const decodeObjectId = jsonWebToken.verify(idObject, process.env.SECRET_TOKEN);
    if (decodeObjectId.objectId === req.auth.userId) {
        Sauce.updateOne({ _id: req.params.id }, {...req.body, id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch(error => res.status(400).json({ error }));
    } else {
        return res.status(400).json({ message: "unauthorized request" });
    }
};

exports.deleteSauce = (req, res, next) => {
    const idObject = req.params.id;
    const decodeObjectId = jsonWebToken.verify(idObject, process.env.SECRET_TOKEN);
    if (decodeObjectId.objectId === req.auth.userId) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split("/image/")[1];
                fs.unlink(`image/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Object deleted" }))
                        .catch((error) => res.status(400).json({ error }))
                })
            })
    } else {
        return res.status(400).json({ message: "unauthorized request" });
    }
};

exports.likedSauce = (req, res, next) => {



    Sauce.updateOne({ _id: req.params.id }, { usersLiked: req.auth.userId })

    .then(() => res.status(200).json({ message: "Object liked" }))
        .catch(error => res.status(400).json({ error }));



}