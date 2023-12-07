const { User } = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(sanitizeUser(doc), (err) => {
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res.status(201).json(token);
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.loginUser = async (req, res) => {
  // try {
  //   const user = await User.findOne({ email: req.body.email }).exec();
  //   console.log({ user });
  //   if (!user) {
  //     res.status(401).json({ message: "no such user email" });
  //   } else if (user.password === req.body.password) {
  //     res.status(200).json({
  //       id: user.id,
  //       role: user.role,
  //     });
  //   } else {
  //     res.status(401).json({ message: "invalid credentials" });
  //   }
  // } catch (error) {
  //   res.status(400).json(error);
  // }
  res.json(req.user);
};

exports.checkUser = async (req, res) => {
  // try {
  //   const user = await User.findOne({ email: req.body.email }).exec();
  //   console.log({ user });
  //   if (!user) {
  //     res.status(401).json({ message: "no such user email" });
  //   } else if (user.password === req.body.password) {
  //     res.status(200).json({
  //       id: user.id,
  //       role: user.role,
  //     });
  //   } else {
  //     res.status(401).json({ message: "invalid credentials" });
  //   }
  // } catch (error) {
  //   res.status(400).json(error);
  // }
  res.json({ status: "success", user: req.user });
};
