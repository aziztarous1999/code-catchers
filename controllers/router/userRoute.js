const router = require('express').Router();
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');
let User = require('../../models/user.model');

router.use(authentification);

router.route('/').get(adminGuard,(req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({username,email,password});

  newUser.save()
    .then(() => res.status(200).json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});




router.route('/coursAccesible').get(async(req, res) => {

  await User.findById(req.userData.userId).populate('availableCourses')
    .then(user => res.status(200).json({"coursAccesible":user.availableCourses}))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post( async (req, res) => {

  try{
    const user = await User.findById(req.params.id);

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    

    /********************** image update ***********************/

    if(req.body.job != "")
    {
        user.job = req.body.job;
    }

    await user.save();
    res.status(200).json('User Updated!');

    }catch(err){
      res.status(400).json('Error: ' + err);
    }

  });


  router.route('/delete/:id').get(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
      .then(() => res.status(200).json('User Deleted!'))
      .catch(err => res.status(400).json('Error: ' + err));
  });


module.exports = router;