const router = require("express").Router();
const schedule = require('node-schedule');
const moment = require('moment')
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');
const Stripe = require('stripe')('sk_test_51HsF85HKgsi1BtbNHt8xHu0avspshwn4F5vc12xx0oDMoEvpd06b4gxY69LBpQOChItDrZFJmEf6XCQZdnqFiOwS00Gl7d6pgV');
let Abonnement = require("../../models/abonnement.model");
let User = require("../../models/user.model");

router.use(authentification);
router.route("/create/:paymentIntentId/:nbMonth").get(async (req, res) => {
    const paymentIntent = await Stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    if(paymentIntent.status == 'succeeded'){
    try{
    const idUser = await User.findById(req.userData.userId);
    const nbMonths = req.params.nbMonth;

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
    }
    else {
        res.status(401).json('paymentIntent.status: '+paymentIntent.status);
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
