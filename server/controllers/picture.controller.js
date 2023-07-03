const mongoose = require('mongoose');
const Picture = require('../models/picture.model');

module.exports.uploadPicture = (req,res,next) => {
    try {
        if(req.file) {
            let picture = new Picture();
            picture.userId = req._id;
            picture.content = req.file.buffer;
            picture.save((err, picture) => {
                if (!err) {
                    res.send(picture);
                } else {
                    console.error(err);
                    return next(err);
                }
            });
        }
        
    } catch(err) {
        console.log(err);
    }
    
};

module.exports.getPictures = (req,res,next) => {
    Picture.find({userId: req._id}, (err, pictures) => {
        if (!err) {
            res.contentType('image/jpg');
            if (pictures.length > 1) {
                res.send([pictures[0], pictures.slice(-1)[0]]);
            }
            else if (pictures.length === 1) {
                res.send([pictures[0]]);
            }
            else {
                res.send([]);
            }
        } else {
            return next(err);
        }
    });
}

module.exports.getPicture = (req,res,next) => {
    Picture.findById(req.params.id, (err, pic) => {
        if (!err) {
            res.contentType('image/jpg');
            res.send(pic.content);
        } else {
            console.log(err);
            return next(err);
        }
    });
}

module.exports.deletePicture = async (req,res,next) => {
    try {
        await Picture.deleteOne({_id: req.params.id});
        res.send({ok: true});
    }
    catch(err) {
        console.error(err);
        res.status(500).send(err.message)
    }
};