const Cours = require('./../../models/cours.model');
const Stripe = require('stripe')('sk_test_51HsF85HKgsi1BtbNHt8xHu0avspshwn4F5vc12xx0oDMoEvpd06b4gxY69LBpQOChItDrZFJmEf6XCQZdnqFiOwS00Gl7d6pgV');
exports.getCheckoutSession  = async (req, res, next) => {
    try{
    // 1) Get the Course
    const cours = await Cours.findById(req.params.coursId);

    // 2) Create checkout session
    const session = await Stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:[
            {
                currency: 'usd',
                name: cours.title,
                description: cours.description,
                images: ['https://www.ittvis.com/wp-content/uploads/2020/10/online-tutorials-and-training-illustration-scaled.jpg'],
                amount: (cours.price * 1 ) * 100,
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/course',
        cancel_url: 'http://localhost:3000/course',
        customer_email: req.userData.email,
        client_reference_id: req.params.coursId
    });

    // 3) Create session as response

    res.status(200).json({
        status: 'success',
        session
    });
    }catch(err){
        res.status(err.statusCode).json({
            message: err.message
        });
    }

}