const mysql = require("mysql");
const user = {};
const restaurant = {};
const userpayment = {};
const menu = {};
const submenu = {};
const cart = {};
const review = {};
const love = {};
const coupon = {};
const strtoint = require("../Func/func").strtoint;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "baemin",
});

db.connect();

user.insert = function (data, callback) {
  let sql =
    "INSERT INTO userinf(my_id,my_password,my_mail,my_name,my_character) VALUES (?,?,?,?,?)";
  db.query(
    sql,
    [
      data.my_id,
      data.my_password,
      data.my_mail,
      data.my_name,
      data.my_character,
    ],
    function (err, rows) {
      if (err) throw error;
      else {
        let check = true;
        callback(check);
        console.log("회원가입정보 등록!!");
      }
    }
  );
};

user.login = function (data, callback) {
  console.log(data);
  let sql = "SELECT my_id,my_password FROM userinf";
  db.query(sql, function (err, rows) {
    if (err) throw error;
    else {
      for (let i = 0; i < rows.length; i++) {
        let check = false;
        if (
          data.my_id == rows[i].my_id &&
          data.my_password == rows[i].my_password
        ) {
          console.log("로그인 성공!!");
          check = true;
          callback(check);
        }
      }
    }
  });
};

user.placeChange = function (place, id, callback) {
  let sql = "UPDATE userinf SET my_place=? WHERE my_id=?";
  db.query(sql, [place, id], function (err, rows) {
    if (err) throw error;
    else {
      console.log("가져오기성공");
      callback(place);
    }
  });
};

user.placeShow = function (id, callback) {
  console.log(id);
  let sql = "SELECT my_place FROM userinf WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      console.log(rows);
      callback(rows);
    }
  });
};

user.searchid = function (data, callback) {
  let sql = "SELECT my_id FROM userinf WHERE my_mail=? ";
  db.query(sql, [data], function (err, rows) {
    if (err) throw error;

    callback(rows);
  });
};

user.searchpassword = function (data, callback) {
  let sql = "SELECT my_password FROM userinf WHERE my_id=?";
  db.query(sql, [data], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

user.character = function (id, callback) {
  let sql = "SELECT my_character FROM userinf WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      if (rows[0].my_character == 1) {
        callback(false);
      } else if (rows[0].my_character == 2) {
        callback(true);
      }
    }
  });
};

user.list = function (id, callback) {
  let sql = "SELECT * FROM userinf WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

userpayment.insert = function (data) {
  let sql =
    "INSERT INTO userpayment(my_id,restaurant_name,menu,price,submenu) VALUES(?,?,?,?,?)";
  db.query(
    sql,
    [data.my_id, data.restaurant_name, data.menu, data.price, data.submenu],
    function (err, rows) {
      if (err) throw err;
      else {
        console.log("userpayment 데이타베이스 잘들어감!");
      }
    }
  );
};

userpayment.list = function (id, callback) {
  let sql = "SELECT * FROM userpayment WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      console.log(rows);
      if (rows.length < 1) {
        callback(false, rows);
      } else {
        callback(true, rows);
      }
    }
  });
};

restaurant.insert = function (data, id) {
  console.log(data);
  let sql =
    "INSERT INTO restaurant(my_id,restaurant_name,address,place,kategorie) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [id, data.restaurant_name, data.address, data.place, data.kategorie],
    function (err, rows) {
      if (err) throw error;

      console.log("레스토랑 입력완료!");
    }
  );
};

restaurant.list = function (kategorie, place, callback) {
  let p = strtoint(place);
  let gogo = [];
  let sql = "SELECT * FROM restaurant WHERE kategorie=?";
  db.query(sql, [kategorie], function (err, rows) {
    if (err) throw error;
    else {
      console.log(rows);
      for (let i = 0; i < rows.length; i++) {
        let o = strtoint(rows[i].place);
        if (o[0] + 0.01 > p[0] && o[0] - 0.01 < p[0]) {
          if (o[1] + 0.01 > p[1] && o[1] - 0.01 < p[1]) {
            gogo.push(rows[i]);
          }
        }
      }
      console.log(gogo);
      callback(gogo);
    }
  });
};

restaurant.pay = function (num, callback) {
  let sql = "SELECT * FROM restaurant WHERE num=?";
  db.query(sql, [num], function (err, rows) {
    if (err) throw error;

    callback(rows);
  });
};

restaurant.show = function (id, callback) {
  let sql = "SELECT * FROM restaurant WHERE my_id=?";
  console.log(id);
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

menu.insert = function (files, data, datalength) {
  let sql =
    "INSERT INTO menu (restaurant_name,menu,comment,price,imgfile,introduce) VALUES(?,?,?,?,?,?)";

  function check(data, datalength, i) {
    if (datalength == 1) {
      return String(data);
    } else {
      return String(data[i]);
    }
  }
  for (let i = 0; i < datalength; i++) {
    let menu = check(data.menu, datalength, i);
    let price = check(data.price, datalength, i);
    let comment = check(data.comment, datalength, i);
    let file = String(files[i].filename);
    let introduce = String(data.introduce);

    console.log(menu, price, comment, file, introduce, data.restaurant_name);

    db.query(
      sql,
      [data.restaurant_name, menu, comment, price, file, introduce],
      function (err, rows) {
        if (err) throw error;
        else {
          console.log("메뉴 등록 완료!!");
        }
      }
    );
  }
};

menu.list = function (name, callback) {
  let sql = "SELECT * FROM menu WHERE restaurant_name=?";
  db.query(sql, [name], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

menu.show = function (num, callback) {
  let sql = "SELECT * FROM menu WHERE num=?";
  db.query(sql, [num], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

menu.delete = function (num) {
  let sql = "DELETE FROM menu WHERE num=?";
  db.query(sql, [num], function (err, rows) {
    if (err) throw error;

    console.log("삭제완료!");
  });
};

menu.update = function (data, length) {
  for (let i = 0; i < length; i++) {
    let sql =
      "UPDATE menu SET menu=?,comment=?,price=?,introduce=? WHERE num=?";
    db.query(
      sql,
      [
        data.menu[i],
        data.comment[i],
        data.price[i],
        data.introduce,
        data.num[i],
      ],
      function (err, rows) {
        if (err) throw error;
        else {
          console.log("업데이트 완료!");
        }
      }
    );
  }
};

menu.minupdate = function (resname, minprice, time) {
  let sql = "UPDATE menu SET minprice=?,time=? WHERE restaurant_name=?";
  db.query(sql, [minprice, time, resname], function (err, rows) {
    if (err) throw error;
    else {
      console.log("업데이트완료!");
    }
  });
};

menu.add = function (data, datalength, length, file) {
  let j = 0;
  let rsname;
  if ("string" === typeof data.resname) {
    rsname = data.resname;
  } else {
    rsname = data.resname[0];
  }
  for (let i = length; i < datalength; i++) {
    console.log(j);
    let sql =
      "INSERT INTO menu (restaurant_name,introduce,menu,price,comment,imgfile) VALUES (?,?,?,?,?,?)";
    db.query(
      sql,
      [
        rsname,
        data.introduce,
        data.menu[i],
        data.price[i],
        data.comment[i],
        file[j].filename,
      ],
      function (err, rows) {
        if (err) throw error;
        else {
          console.log("add완료!");
        }
      }
    );
    j++;
  }
};

submenu.insert = function (data) {
  console.log(typeof data.submenu);
  let sql = "INSERT INTO submenu (menu,submenu,price) VALUES (?,?,?)";
  let length;
  if ("string" === typeof data.submenu) {
    length = 1;
  } else {
    length = data.submenu.length;
  }
  function check(data, i) {
    if ("string" === typeof data) {
      return data;
    } else {
      return data[i];
    }
  }

  console.log(length);
  for (let i = 0; i < length; i++) {
    let a = check(data.submenu, i);
    let b = check(data.price, i);

    console.log(data.menu, a, b);
    db.query(sql, [data.menu, a, b], function (err, rows) {
      if (err) throw error;
      else {
        console.log("서브메뉴 입력완료!");
      }
    });
  }
};

submenu.list = function (menu, callback) {
  let sql = "SELECT * FROM submenu WHERE menu=?";
  db.query(sql, [menu], function (err, rows) {
    if (err) throw error;

    callback(rows);
  });
};

cart.insert = function (id, menu, submenu, price, resname) {
  // let length=submenu.length;
  sub = String(submenu);
  console.log(typeof price);
  console.log(id, menu, sub, price, resname);
  let sql =
    "INSERT INTO cart (my_id,menu,submenu,price,restaurant_name) VALUES (?,?,?,?,?)";
  db.query(sql, [id, menu, sub, price, resname], function (err, rows) {
    if (err) throw error;
    else {
      console.log("잘입력됨");
    }
  });
};

cart.list = function (id, callback) {
  let sql = "SELECT * FROM cart WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      console.log("카트리스트");
      callback(rows);
    }
  });
};

cart.delete = function (num) {
  let sql = "DELETE FROM cart WHERE num=?";
  db.query(sql, [num], function (err, rows) {
    if (err) throw error;
    else {
      console.log("잘삭제됨");
    }
  });
};

review.insert = function (id, data, file) {
  let sstar = Number(data.star);
  let sql =
    "INSERT INTO review (my_id,restaurant_name,review,star,imgfile) VALUES(?,?,?,?,?)";
  db.query(
    sql,
    [id, data.resname, data.review, sstar, file],
    function (err, rows) {
      if (err) throw error;
      else {
        console.log("Review 추가완료");
      }
    }
  );
};

review.list = function (resname, callback) {
  console.log(resname);
  let sql = "SELECT * FROM review WHERE restaurant_name=?";
  db.query(sql, [resname], function (err, rows) {
    if (err) throw error;
    else {
      console.log("리뷰가져오기" + rows);

      callback(rows);
    }
  });
};

love.insert = function (my_id, loveres) {
  console.log(my_id, loveres);
  let sql = "INSERT INTO love (my_id,love_restaurant) VALUES(?,?)";
  db.query(sql, [my_id, loveres], function (err, rows) {
    if (err) throw error;
  });
};

love.delete = function (my_id, loveres) {
  let sql = "DELETE FROM love WHERE my_id=? AND love_restaurant=?";
  db.query(sql, [my_id, loveres], function (err, rows) {
    if (err) throw error;
  });
};

love.list = function (resname, callback) {
  let sql = "SELECT * FROM love WHERE love_restaurant=?";
  db.query(sql, [resname], function (err, rows) {
    if (err) throw error;
    else {
      console.log(rows);
      callback(rows);
    }
  });
};

love.show = function (id, callback) {
  let sql = "SELECT * FROM love WHERE my_id=?";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

coupon.insert = function (id, coupon, couponid) {
  let sql = "INSERT INTO coupon(my_id,coupon,couponid) VALUES(?,?,?)";
  db.query(sql, [id, coupon, couponid], function (err, rows) {
    if (err) throw error;
  });
};

coupon.check = function (id, callback) {
  let sql = "SELECT * FROM coupon WHERE my_id=? ";
  db.query(sql, [id], function (err, rows) {
    if (err) throw error;
    else {
      callback(rows);
    }
  });
};

module.exports = {
  user,
  restaurant,
  userpayment,
  menu,
  submenu,
  cart,
  review,
  love,
  coupon,
};
