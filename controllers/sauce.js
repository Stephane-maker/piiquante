const Sauce = require("../models/sauce");
const fs = require("fs");
const { cp } = require("fs/promises");
const { collection } = require("../models/sauce");
const sauce = require("../models/sauce");



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
        .then((sauce) => {
            if (sauce.userId === req.auth.userId) {
                const sauceObject = req.file ? {
                    ...req.body,
                    imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
                } : {...req.body };

                if (sauceObject.imageUrl) {
                    req.body = sauceObject;
                    const filename = sauce.imageUrl.split("/image/")[1];
                    try {
                        const modifyImage = JSON.parse(req.body.sauce)
                        modifyImage.imageUrl = sauceObject.imageUrl
                        fs.unlinkSync(`image/${filename}`)
                        Sauce.updateOne({ _id: req.params.id }, {...modifyImage, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                            .catch(error => res.status(400).json({ error }));
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
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

function LikeAndDislike(argument, orderDB, res, req) {
    Sauce.updateMany({ _id: req.params.id }, {
            [argument]: {
                [orderDB]: req.auth.userId
            }
        })
        .then(() => res.status(200).json({ message: "Object liked" }))
        .catch(() => res.status(400).json({ message: "An error has occurred" }))
}

exports.likedSauce = (req, res, next) => {

    return Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (req.body.like) {
                case 1:
                    if (!sauce.usersLiked.includes(req.auth.userId)) {
                        return LikeAndDislike("$push", "usersLiked", res, req)
                    }
                    break;
                case 0:

                    if (sauce.usersLiked.includes(req.auth.userId)) {
                        return LikeAndDislike("$pull", "usersLiked", res, req)
                    } else {
                        return LikeAndDislike("$pull", "usersDisliked", res, req)
                    }

                    break;
                case -1:
                    if (!sauce.usersDisliked.includes(req.auth.userId)) {
                        return LikeAndDislike("$push", "usersDisliked", res, req)
                    }
                    break;

                default:
                    break;
            }
        })
        .catch((error) => res.status(400).json({ error }))
}