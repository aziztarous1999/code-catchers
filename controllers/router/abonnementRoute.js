const router = require("express").Router();
const schedule = require('node-schedule');
const moment = require('moment')
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');

let Abonnement = require("../../models/abonnement.model");
let User = require("../../models/user.model");

router.use(authentification);
router.route("/create").post(async (req, res) => {
    try{
    const idUser = await User.findById(req.userData.userId);
    const nbMonths = req.body.nbMonths;

    idUser.abonner = true;
    await idUser.save();
    const newAbonnement = new Abonnement({idUser,nbMonths});

    schedule.scheduleJob( moment().add(nbMonths, 'months').toDate(),async function(){
        idUser.abonner = false;
        await idUser.save();
      });

    
    await newAbonnement.save()
    res.status(200).json('Abonnement added!');

    }catch(err){
        res.status(400).json('Error: ' + err)
    }

});



router.route("/historic").get(async (req, res) => {
    const idUser = await User.findById(req.userData.userId);

    await Abonnement.find({idUser
    },null,{ sort :{ createdAt : -1}})
    .then((abonnements) => res.status(200).json({'abonnements:':abonnements}))
    .catch(err => res.status(400).json('Error: ' + err));

});


router.route("/allHistoric").get(adminGuard,async (req, res) => {
    await Abonnement.find(null
    ,null,{ sort :{ createdAt : -1}})
    .then((abonnements) => res.status(200).json({'allAbonnements:':abonnements}))
    .catch(err => res.status(400).json('Error: ' + err));

});

module.exports = router;
