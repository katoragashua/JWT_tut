const { Router } = require("express");
const router = Router();
const {
  signup_GET,
  login_GET,
  login_POST,
  signup_POST,
  logout_GET,
} = require("../controllers/authControllers");

router.get("/signup", signup_GET);
router.get("/signin", login_GET);
router.post("/signup", signup_POST);
router.post("/signin", login_POST);
router.get("/signout", logout_GET);

module.exports = router;
