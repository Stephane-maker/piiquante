const Sauce = require("../models/sauce");
const fs = require("fs");
const { cp } = require("fs/promises");

require("dotenv").config()

exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce)
    delete SauceObject._id

    SauceObject.idCompare = req.auth.userId;
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
        .then((sauce) => {
            if (req.auth.userId === sauce.idCompare) {
                Sauce.updateOne({ _id: req.params.id }, {...req.body, id: req.params.id })
                return res.status(200).json({ message: "Object modified" })
            } else {
                return (res.status(400).json({ message: "unauthorized request" }));
            }
        })
};

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/image/")[1];
            fs.unlink(`image/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Object deleted" }))
                    .catch((error) => res.status(400).json({ error }))
            })
        })
        .catch(res.status(400).json({ message: "unauthorized request" }));

};

exports.likedSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(req.body)
            if (req.body.like === 1 && !sauce.usersLiked.includes(req.auth.userId) && !sauce.usersDisliked.includes(req.auth.userId)) {
                Sauce.updateMany({ "_id": req.params.id }, { '$push': { 'usersLiked': req.auth.userId } })
                    .then(() => res.status(200).json({ message: "Object liked" }))
                    .catch(() => res.status(400).json({ message: "An error has occurred" }))

            }
            if (req.body.like === 1 && sauce.usersLiked.includes(req.auth.userId)) {
                Sauce.updateMany({ "_id": req.params.id }, { '$pull': { "usersLiked": req.auth.userId } })
                    .then(() => res.status(200).json({ message: "Object liked" }))
                    .catch(() => res.status(400).json({ message: "An error has occurred" }));


            }
            if (req.body.like === -1 && sauce.usersLiked.includes(req.auth.userId)) {
                return false


            }

            if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateMany({ "_id": req.params.id }, { '$pull': { "usersLiked": req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object disliked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                }
                if (!sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateMany({ "_id": req.params.id }, { '$pull': { "usersDisliked": req.auth.userId } })
                        .then(() => res.status(200).json({ message: "Object disliked" }))
                        .catch(() => res.status(400).json({ message: "An error has occurred" }))
                }
            }

            if (req.body.like === -1 && !sauce.usersDisliked.includes(req.auth.userId) && !sauce.usersLiked.includes(req.auth.userId)) {
                Sauce.updateMany({ "_id": req.params.id }, { '$push': { 'usersDisliked': req.auth.userId } })
                    .then(() => res.status(200).json({ message: "Object liked" }))
                    .catch(() => res.status(400).json({ message: "An error has occurred" }))
            }
            if (req.body.like === -1 && sauce.usersDisliked.includes(req.auth.userId)) {
                Sauce.updateMany({ "_id": req.params.id }, { '$pull': { 'usersDisliked': req.auth.userId } })
                    .then(() => res.status(200).json({ message: "Object liked" }))
                    .catch(() => res.status(400).json({ message: "An error has occurred" }))
            }


        })
        .catch((error) => res.status(400).json({ error }))
}

exports.disLikeSauce = (req, res, next) => {
    console.log("ok");
}