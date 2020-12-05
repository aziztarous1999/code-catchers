const router = require("express").Router();
const authentification = require('../auth/authentification');
const stripeController = require('./../stripeController/stripeController');


router.get('/checkout-session/:coursId',authentification, stripeController.getCheckoutSession);
router.post('/checkout-subscribe-session/',authentification, stripeController.getSubCheckoutSession);

module.exports = router;