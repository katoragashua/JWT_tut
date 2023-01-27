const { Router } = require("express");
const router = Router();
const {
  signup_GET,
  login_GET,
  login_POST,
  signup_POST,
} = require("../controllers/authControllers");

router.get("/signup", signup_GET);
router.get("/login", login_GET);
router.post("/signup", signup_POST);
router.post("/login", login_POST);

module.exports = router;
