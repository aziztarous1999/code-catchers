const router = require('express').Router();
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');
const upload = require('../../utils/storage');
let User = require('../../models/user.model');
let Cours = require('../../models/cours.model');
let Review = require('../../models/review.model');



router.route('/').get((req, res) => {
    Cours.find()
    .then(courses => res.status(200).json(courses))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:coursId').get((req, res) => {
  Cours.findById(req.params.coursId)
  .then(course => res.status(200).json(course))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.use(authentification);

router.route('/add').post(upload.array('videos'),async (req, res) => {
  const owner = await User.findById(req.userData.userId);
  const listStudients = [];
  const price = req.body.price;
  const rating = 0;
  const description = req.body.description;
  const title = req.body.title;
  /****************** video upload **************** */
  const listVideo = req.files.map(file =>{ return file.path});


  console.log(req.files);

  const newCours = new Cours({owner,listStudients,price,rating,description,title,listVideo});

  newCours.save()
    .then(() => res.status(200).json('Cours added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


  router.route('/delete/:id').get(adminGuard,async (req, res) => {
    await Cours.findByIdAndDelete(req.params.id)
      .then(() => res.status(200).json('Cours Deleted!'))
      .catch(err => res.status(400).json('Error: ' + err));
  });


  router.route('/activate/:id').get(adminGuard,async (req, res) => {
    try{
    const cours = await Cours.findById(req.params.id);
    cours.active = true;

    await cours.save();
    res.status(200).json('Cours Activated!');

    }catch(err){
      res.status(400).json('Error: ' + err);
    }
      
  });

  router.route('/likes/:id').get(async (req, res) => {

      await Cours.findById(req.params.id).then((cours)=> res.status(200).json({likes:cours.likes}))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

  router.route('/review').post(async (req, res) => {
try{
    const like = req.body.like;
    const owner = await User.findById(req.userData.userId);
    const comment = req.body.comment;
    const courId = await Cours.findById(req.body.courId);
    
    
    let myCour = await Cours.findOne({"listStudients":owner});

    
    if(myCour){
      const review = new Review({like,owner,comment,courId});
      await review.save();

      if(like){
        myCour.likes++;
      }

      myCour.feedback.push(review);
      await myCour.save();
    }else{
      throw new Error("You don't have access to this cours!");
    }


    res.status(200).json({myCour});
    }catch(err){
      res.status(400).json('Error: ' + err)
    };
  });


module.exports = router;