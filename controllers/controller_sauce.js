const Sauce = require("../models/sauce");
const fs = require("fs");
const jsonWebToken = require("jsonwebtoken");



exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce)
    delete SauceObject._id

    SauceObject._id = jsonWebToken.sign({ userId: req.auth.userId }, "RANDOM_SECRET_TOKEN");

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
exports.modifiySauce = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, {...req.body, id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié" }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    const token = req.params.id;

    const decodeToken = jsonWebToken.verify(token, "RANDOM_SECRET_TOKEN");

    if (decodeToken.userId === req.auth.userId) {
        console.log("ok")
    } else {
        console.log("non")
    }





    // Sauce.findOne({ _id: req.params.id })
    //     .then(sauce => {
    //         const filename = sauce.imageUrl.split('/image/')[1];
    //         fs.unlink(`image/${filename}`, () => {
    //             Sauce.deleteOne({ _id: req.params.id })
    //                 .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
    //                 .catch(error => res.status(400).json({ error }));
    //         });
    //     })
    //     .catch(error => res.status(500).json({ error }));
};