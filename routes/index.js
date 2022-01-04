var express = require("express");
var router = express.Router();
const { user, restaurnt } = require("../data/data");
/* GET home page. */
router.get("/", function (req, res, next) {
  let ssss = req.session;

  console.log(ssss.username);
  res.render("index", { pass: true });
});

router.post("/", function (req, res, next) {
  console.log(req.body.place);
  user.placeChange(
    req.body.place,
    req.session.username,
    function callback(result) {
      console.log(result);
    }
  );
  res.render("index", { pass: true });
});

module.exports = router;
