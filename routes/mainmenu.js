const e = require("express");
var express = require("express");
var router = express.Router();
const {
  user,
  restaurant,
  menu,
  submenu,
  cart,
  review,
  love,
  coupon
} = require("../data/data");
/* GET home page. */
router.get("/reslist", function (req, res, next) {
  res.render("reslist");
});

router.get("/menu/:food", function (req, res, next) {
  let ssss = req.session;

  if (ssss.username === undefined) {
    res.send(
      '<script type="text/javascript">alert("로그인 부터해주세요")+history.back();</script>'
    );
  } else {
    user.placeShow(ssss.username, function callback(placeresult) {
      if (placeresult[0].my_place === null) {
        res.send(
          '<script type="text/javascript">alert("주소를 입력해주세요")+history.back();</script>'
        );
      } else {
        restaurant.list(
          req.params.food,
          placeresult[0].my_place,
          function callback(result) {
            res.render("reslist", {
              data: result,
            });
          }
        );
      }
    });
  }
});

router.get("/pay", function (req, res, next) {
  cart.list(req.session.username, function callback(result) {


    res.render("pay", { data: result });
  });
});

router.get("/resmenu/:name", function (req, res, next) {
  review.list(req.params.name, function callback(review) {
    let sum = 0;
    for (let i = 0; i < review.length; i++) {
      sum += review[i].star;
    }
    let totalstar = sum / review.length;
    love.list(req.params.name, function callback(love) {
      let check = false;
      for (let i = 0; i < love.length; i++) {
        if (req.session.username == love[i].my_id) {
          check = true;
        }
      }
      if (check == true) {
        let firstlove = "찜♥";
        res.render("resmenu", {
          resname: req.params.name,
          data: review,
          star: totalstar,
          love: love,
          firstlove: firstlove,
        });
      } else if (check == false) {
        let firstlove = "찜♡";
        res.render("resmenu", {
          resname: req.params.name,
          data: review,
          star: totalstar,
          love: love,
          firstlove: firstlove,
        });
      }
    });
  });
});

router.get("/resmenu", function (req, res, next) {
  
  if (req.query.data == 1) {
    menu.list(req.query.name, function callback(result) {
      res.send({ result: result });
    });
  } else if (req.query.data == 2) {
    menu.list(req.query.name, function callback(result) {
      res.send({ result: result });
    });
  } else if (req.query.data == 3) {
    review.list(req.query.name, function callback(result) {
      res.send({ result: result });
    });
  } else if (req.query.data == 4) {
    love.insert(req.session.username, req.query.name);
    let result = 1;
    res.send({ result: result });
  } else if (req.query.data == 5) {
    love.delete(req.session.username, req.query.name);
    let result = 1;
    res.send({ result: result });
  }
});

router.get("/submenu/:num", function (req, res, next) {
  menu.show(req.params.num, function callback(result) {
    submenu.list(result[0].menu, function callback(result2) {
      res.render("submenu", { data: result, data2: result2 });
    });
  });
});

router.get("/submenu", function (req, res, next) {
 
  if (req.query.data == 1) {
    let result = req.query.sum;
    res.send({ result: result });
  } else if (req.query.data == 2) {
    cart.insert(
      req.session.username,
      req.query.menu,
      req.query.submenu,
      req.query.sum,
      req.query.resname
    );
    let result = "장바구니 추가완료!";
    res.send({ result: result });
  }
});

module.exports = router;
