const router = require("express").Router();
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');

let Payment = require("../../models/payment.model");
let User = require("../../models/user.model");
let Cours = require("../../models/cours.model");
let Abonnement = require("../../models/abonnement.model");


router.use(authentification);
router.route("/create").post(async (req, res) => {
    try{
    const idCours = await Cours.findById(req.body.idCours);
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
