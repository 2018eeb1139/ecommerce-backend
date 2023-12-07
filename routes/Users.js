const express = require("express");
const {
  fetchUserById,
  updateUser,
  fetchAllUsers,
} = require("../controller/User");

const router = express.Router();

router
  .get("/", fetchAllUsers)
  .get("/:id", fetchUserById)
  .patch("/:id", updateUser);

exports.router = router;
