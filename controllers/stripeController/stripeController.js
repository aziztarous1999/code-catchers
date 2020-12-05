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
        client_reference_id: req.userData.userId
    });

    // 3) Create session as response
    /*try{
    const paymentIntent = await Stripe.paymentIntents.retrieve('pi_1HuzQuHKgsi1BtbNLqVctwus');
    console.log(paymentIntent.status);}
    catch(err){
        console.log(err);
    }*/

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

exports.getSubCheckoutSession = async (req, res, next) => {
    
    try {
      const session = await Stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            currency: 'usd',
            name: req.body.title,
            description: req.body.description,
            images: ['https://miro.medium.com/max/3200/1*EuG_m_d3HIVC_LC6K8O1Kw.png'],
            amount: (req.body.price * 1 ) * 100,
            quantity: 1,
          },
        ],
        
        success_url: 'http://localhost:3000/Pricing',
        cancel_url: 'http://localhost:3000/Pricing',
        customer_email: req.userData.email,
        client_reference_id: req.userData.userId
      });
  
      res.send({
        session
      });
    } catch (e) {
      res.status(400);
      return res.send({
        error: {
          message: e.message,
        }
      });
    }
}