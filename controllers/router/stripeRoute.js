const router = require("express").Router();
const authentification = require('../auth/authentification');
const stripeController = require('./../stripeController/stripeController');


router.get('/checkout-session/:coursId',authentification, stripeController.getCheckoutSession);

module.exports = router;