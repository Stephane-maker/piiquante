const Sauce = require("../models/sauce");
const fs = require("fs");
const { cp } = require("fs/promises");

require("dotenv").config();

exports.createSauce = (req, res, next) => {

    const SauceObject = JSON.parse(req.body.sauce)
    delete SauceObject._id
    SauceObject.userId = req.auth.userId;
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

    .then(sauce => {
        sauce.likes = sauce.usersLiked.length;
        sauce.dislikes = sauce.usersDisliked.length;

        return res.status(200).json(sauce);
    })

    .catch(error => res.status(400).json({ error }));
};

exports.selectAllSauce = (req, res, next) => {

    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};
exports.modifySauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })

    console.log(req.body)
    Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));



}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId === req.auth.userId) {
                const filename = sauce.imageUrl.split("/image/")[1];
                fs.unlink(`image/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Object deleted" }))
                        .catch((error) => res.status(400).json({ error }))
                })
            } else {
                return res.status(400).json({ message: "unauthorized request" })
            }
        })
};

exports.likedSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.body.like === 1) {
                if (!sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateMany({ _id: req.params.id }, { "$push": { "usersLiked": req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object liked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                }
            }
            if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateMany({ _id: req.params.id }, { "$pull": { "usersLiked": req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object liked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                } else {
                    Sauce.updateMany({ _id: req.params.id }, { '$pull': { 'usersDisliked': req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object liked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                }
            }

            if (req.body.like === -1) {
                if (!sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateMany({ _id: req.params.id }, { '$push': { 'usersDisliked': req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object liked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                }
            }
        })
        .catch((error) => res.status(400).json({ error }))
}