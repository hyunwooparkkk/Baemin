var express = require("express");
var router = express.Router();
const {
  user,
  restaurant,
  userpayment,
  menu,
  submenu,
  cart,
  review,
  love,
  coupon,
} = require("../data/data");
const multer = require("multer");
const uploader = multer({ dest: "upload/" });

router.get("/love", function (req, res, next) {
  if (req.session.username === undefined) {
    res.send(
      '<script type="text/javascript">alert("로그인부터 해주세요")+history.back() ;</script>'
    );
  }
  love.show(req.session.username, function callback(result) {
    res.render("love", { data: result });
  });
});

router.get("/paylist", function (req, res, next) {
  if (req.session.username === undefined) {
    res.send(
      '<script type="text/javascript">alert("로그인부터 해주세요")+history.back() ;</script>'
    );
  } else {
    userpayment.list(req.session.username, function callback(check, result) {
      if (check == false) {
        res.render("notpaylist", { data: req.session.username });
      } else {
        res.render("paylist", { data: result });
      }
    });
  }
});
router.get("/paylist/:id", function (req, res, next) {
  if (req.params.id == 1) {
    cart.list(req.session.username, function callback(result) {
      for (let i = 0; i < result.length; i++) {
        userpayment.insert(result[i]);
        cart.delete(result[i].num);
      }

      res.render("index", { pass: true });
    });
  }

  res.render("index", { pass: true });
});
router.get("/notpaylist", function (req, res, next) {
  res.render("notpaylist");
});

router.get("/my", function (req, res, next) {
  if (req.session.username === undefined) {
    res.send(
      '<script type="text/javascript">alert("로그인부터 해주세요")+history.back() ;</script>'
    );
  } else {
    user.list(req.session.username, function callback(result) {
      result[0].my_character == "1"
        ? res.render("my", { data: result })
        : restaurant.show(result[0].my_id, function callback(back) {
            res.render("ceomy", { data: result, restaurant: back });
          });
    });
  }
});

router.post("/ceomy", function (req, res, next) {
  res.render("ceomy");
});

router.get("/cart/:resname", function (req, res, next) {
  cart.list(req.session.username, function callback(result) {
    res.render("cart", { data: result, resname: req.params.resname });
  });
});

router.get("/cart", function (req, res, next) {
  if (req.session.username === undefined) {
    res.send(
      '<script type="text/javascript">alert("로그인부터 해주세요")+history.back() ;</script>'
    );
  } else {
    if (req.query.data == 1) {
      cart.delete(req.query.num);
      let result = "삭제완료!";
      res.send({ result: result });
    } else if (req.query.data == 2) {
      for (let i = 0; i < req.query.arr.length; i++) {
        cart.delete(req.query.arr[i]);
      }
      let result = "전체삭제완료!";
      res.send({ result: result });
    }

    cart.list(req.session.username, function callback(result) {
      if (result.restaurant_name === undefined) {
        res.render("ncart");
      } else {
        res.render("cart", {
          data: result,
          resname: result[0].restaurant_name,
        });
      }
    });
  }
});

router.get("/notice", function (req, res, next) {
  res.render("notice");
});
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("login");
});

router.get("/login", function (req, res, next) {
  if (req.session.username != undefined) {
    res.send(
      '<script type="text/javascript">confirm("로그아웃하시겠습니까?")?location.href="/nav/logout":history.back() ;</script>'
    );
  } else {
    res.render("login");
  }
});
router.post("/login", function (req, res, next) {
  user.login(req.body, function callback(check) {
    if (check == true) {
      let ssss = req.session;
      ssss.username = req.body.my_id;
      res.render("index", { pass: true });
    } else {
      res.render("login");
    }
  });
});

router.get("/login/searchid", function (req, res, next) {
  res.render("searchid");
});

router.post("/login/searchid", function (req, res, next) {
  user.searchid(req.body.mail, function callback(result) {
    res.send("당신의 아이디는:" + result[0].my_id);
  });
});

router.get("/login/searchpassword", function (req, res, next) {
  res.render("searchpassword");
});

router.post("/login/searchpassword", function (req, res, next) {
  user.searchpassword(req.body.id, function callback(result) {
    res.send("당신의 비밀번호는:" + result[0].my_password);
  });
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.post("/register", function (req, res, next) {
  user.insert(req.body, function callback(check) {
    res.render("index", { pass: true });
  });
});

router.get("/restaurant", function (req, res, next) {
  let ssss = req.session;
  if (ssss.username === undefined) {
    res.render("index", { pass: false });
  } else {
    user.character(ssss.username, function callback(result) {
      if (result == false) {
        res.send(
          '<script type="text/javascript">alert("사장님 전용 페이지입니다")+history.back();</script>'
        );
      } else {
        res.render("restaurant");
      }
    });
  }
});

router.post("/restaurant", function (req, res, next) {

  restaurant.insert(req.body, req.session.username);

  res.redirect("restaurant");
});

router.get("/gogo", function (req, res, next) {
  restaurant.list(function callback(result) {
    res.render("gogo", {
      data: result[0].restaurant_name,
    });
  });
});

router.get("/fooddelete/:num/:resname", function (req, res, next) {
  let num = Number(req.params.num);
  menu.delete(num);
  res.redirect("/nav/foodupdate/" + req.params.resname);
});

router.get("/foodupdate/:id", function (req, res, next) {
  menu.list(req.params.id, function callback(result) {
    res.render("foodupdate", {
      data: result,
    });
  });
});
router.post("/foodupdate", uploader.array("img"), function (req, res, next) {
  let datalength = req.body.price.length;
  let num;
  if ("string" === typeof req.body.num) {
    num = 1;
  } else {
    num = req.body.num.length;
  }

  let rsname;
  if ("string" === typeof req.body.resname) {
    rsname = req.body.resname;
  } else {
    rsname = req.body.resname[0];
  }

  if (datalength == 0) {
    res.send(
      '<script type="text/javascript">alert("등록할 데이터가 없어요!")+history.back();</script>'
    );
  } else if (datalength == num) {
    menu.update(req.body, num);
    res.redirect("/nav/foodupdate/" + rsname);
  } else if (datalength > num) {
    menu.update(req.body, num);
    menu.add(req.body, datalength, num, req.files);

    res.redirect("/nav/foodupdate/" + rsname);
  }
});

router.get("/foodres/:name", function (req, res, next) {
  res.render("foodres", {
    data: req.params.name,
  });
});

router.post("/foodres", uploader.array("img"), function (req, res, next) {
  menu.insert(req.files, req.body, req.files.length);
  res.render("coupon");
});

router.get("/coupon", function (req, res, next) {
  res.render("coupon");
});

router.post("/coupon", function (req, res, next) {
  coupon.check(req.session.username, function callback(result) {
    let check = false;
    for (let i = 0; i < result.length; i++) {
      if (result[i].couponid == req.body.couponid) {
        check = true;
        res.send(
          '<script type="text/javascript">alert("이미 다운한 쿠폰입니다")+history.back()</script>'
        );
      }
    }
    if (check == false) {
      coupon.insert(req.session.username, req.body.coupon, req.body.couponid);
      res.send(
        '<script type="text/javascript">alert("쿠폰 다운 완료!")+history.back()</script>'
      );
    }
  });
});

router.get("/review/:resname", function (req, res, next) {
  res.render("review", { data: req.params.resname });
});

router.post(
  "/review/:resname",
  uploader.array("img"),
  function (req, res, next) {
    review.insert(req.session.username, req.body, req.files.username);
    res.render("index", {
      pass: true,
    });
  }
);

router.get("/gift", function (req, res, next) {
  res.render("gift");
});

router.get("/point", function (req, res, next) {
  res.render("point");
});

router.get("/subfoodres/:menu", function (req, res, next) {
  res.render("subfoodres", { menu: req.params.menu });
});

router.post("/subfoodres", function (req, res, next) {
  submenu.insert(req.body);
  res.render("index", { pass: true });
});
router.get("/foodmin/:menu", function (req, res, next) {
  res.render("foodmin", { menu: req.params.menu });
});

router.post("/foodmin", function (req, res, next) {
  menu.minupdate(req.body.resname, req.body.minprice, req.body.time);
  res.send(
    '<script type="text/javascript">alert("등록 완료!")+history.back()</script>'
  );
});

module.exports = router;
