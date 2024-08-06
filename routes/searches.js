var express = require('express');
var router = express.Router();

//import des models de Schéma
//require('../models/connection');
const User = require('../models/users');
const Search = require('../models/searches');
const Score = require('../models/score');
const Status_infos = require('../models/status_infos');
const Status = require('../models/status');



// afficher l'utilisateur
router.get('/user', (req, res) => {
    User.find().then(data => {
        res.json({ result: true, data: data });
    })
});

//ajouter une recherche à l'utilisateur
router.post('/user', (req, res) => {
    User.updateOne({ name: req.body.name }, { $push: { searches: req.body.searches } })
        .then((data) => {
            res.json({ result: true, newkey: data })
        })
})

//mettre à jour l'id d'une recherche et effacer la première recherche si plus de 5
router.put('/user', (req, res) => {

    User.findOne({ name: req.body.name }).then(data => {
        console.log(data.searches[0])
        if (data.searches.length < 3) {
            console.log(data.searches.length)
            User.updateOne({ name: req.body.name }, { searches: req.body.searches })
                    res.json({ result: true, newkey: data })
        } else {
            console.log(data.searches.length)
            User.updateOne({ name: req.body.name }, { $pull: { searches: data.searches[0] }, $push: { searches: req.body.searches } })

            res.json({ result: true, newkey: data })
        }

    })
})


//mettre à jour l'id d'un statut_infos et de son score dans la collection research
router.put('/data', (req, res) => {
    Search.updateOne({ _id: req.body._id }, { $set: { score: req.body.score, status_general: req.body.status_general } })
        .then(() => {
            Search.find().then(data => {
                res.json({ result: true, newkeys: data })
            })
        })
})

//mettre à jour l'id d'un statut_infos dans la collection research
router.put('/dt', (req, res) => {
    Search.updateOne({ _id: req.body._id }, { $push: { status_general: req.body.status_general } })
        .then(() => {
            Search.find().then(data => {
                res.json({ result: true, newkeys: data })
            })
        })
})

//mettre à jour statut_id dans la collection status_infos
router.put('/status', (req, res) => {
    Status_infos.updateOne({ _id: req.body._id }, { status_id: req.body.status_id })
        .then(() => {
            Status_infos.find().then(data => {
                res.json({ result: true, newkeys: data })
            })
        })
})

// afficher les utilisateurs
router.get('/foreignkey', (req, res) => {
    User.find()
    .populate('searches')
    .then(data => {
        res.json({ result: true, data: data });
    })
});


module.exports = router;