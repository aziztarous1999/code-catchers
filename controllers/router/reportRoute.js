const router = require('express').Router();
const authentification = require('../auth/authentification');
const adminGuard = require('../auth/role');
let User = require('../../models/user.model');
let Report = require('../../models/report.model');

router.use(authentification);

// add new report 
router.route('/add').post(async (req, res) => {
    const owner = await User.findById(req.userData.userId);

    const description = req.body.description;
    const title = req.body.title;
  
    const report = new Report({title,description,owner});
  
    report.save()
      .then(() => res.status(200).json('Report submited'))
      .catch(err => res.status(400).json('Error: ' + err));
  });


module.exports = router;