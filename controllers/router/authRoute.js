const router = require("express").Router();
const jwt = require("jsonwebtoken");
let User = require("../../models/user.model");

router.route("/login").post(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  await User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throw new Error("Email Incorrect!");
      }
      if (user.password === password) {
        res
          .status(200)
          .json({
            token: jwt.sign(
              { email, userId: user._id, role: user.role },
              process.env.SECRET_CODE
            ),
          });
      } else {
        throw new Error("Password Incorrect!");
      }
    })
    .catch((err) => {
      res.status(403).json(err.message);
    });
});

module.exports = router;
