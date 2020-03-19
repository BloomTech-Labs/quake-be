// authentication router here.
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require("./auth-model.js")

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      // pass the created user into the genToken() method, and get the token
      const token = genToken(saved);
      console.log(_user);
      if (!_user) {
          res.status(400).json({ messege: 'Something went wrong with the Registration' })
      } else {
        // return the user object, and the token.
          res.status(201).json({ created_user: saved, token: token ,messege: 'User Created Succesfully!' })
      }
      
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // pass the found user into the genToken() method, and get the token
        const token = genToken(user);
        // return the found user's username, and the token"
        res.status(200).json({ username: user.username, token: token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function genToken(user) {
  // create the payload...
  const payload = {
    userid: user.id,
    username: user.username
  };

  const options = { expiresIn: "1h" };
  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}

module.exports = router;
