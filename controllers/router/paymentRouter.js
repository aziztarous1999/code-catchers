const router = require("express").Router();
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');

let Payment = require("../../models/payment.model");
let User = require("../../models/user.model");
let Cours = require("../../models/cours.model");
let Abonnement = require("../../models/abonnement.model");

const Stripe = require('stripe')('sk_test_51HsF85HKgsi1BtbNHt8xHu0avspshwn4F5vc12xx0oDMoEvpd06b4gxY69LBpQOChItDrZFJmEf6XCQZdnqFiOwS00Gl7d6pgV');


router.use(authentification);
router.route("/create/:idCours/:paymentIntentId").get(async (req, res) => {
    const paymentIntent = await Stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    if(paymentIntent.status == 'succeeded'){
    try{
    const idCours = await Cours.findById(req.params.idCours);
    const amount = idCours.price;
    const from = await User.findById(req.userData.userId);
    const to = await User.findById(idCours.owner._id);
    console.log(to);
    to.credit += amount-(amount*0.1);
    from.availableCourses.push(idCours);
    idCours.listStudients.push(from);
    await to.save();
    await from.save();
    await idCours.save();
    const newPayment = new Payment({idCours,amount,from,to});

    
    await newPayment.save()
    res.status(200).json('Payment added!');
}
catch(err){
    res.status(400).json('Error: ' + err);
}
}else{
    res.status(401).json('paymentIntent.status: '+paymentIntent.status);
}
});



router.route("/payments").get(async (req, res) => {
    try{
    const from = await User.findById(req.userData.userId);

    await Payment.find({from
    },null,{ sort :{ createdAt : -1}})
    .then((payments) => res.status(200).json({'payments:':payments}))
}catch(err){
    res.status(400).json('Error: ' + err);
}

});

router.route("/allPayments").get(adminGuard,async (req, res) => {

    await Payment.find(null
    ,null,{ sort :{ createdAt : -1}})
    .then((abonnements) => res.status(200).json({'allPayments:':abonnements}))
    .catch(err => res.status(400).json('Error: ' + err));

});



module.exports = router;
