var express = require('express')
var router = express.Router()
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var db = require('../lib/db');
var url = require('url');
var sanitizeHTML = require('sanitize-html');
var AWS = require('aws-sdk');
var formidable = require('formidable');
var cusLogin = require('../lib/cusLogin.js');

AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();

router.get('/', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  db.query(`SELECT * FROM shop`, function (error, shops) {
    if (error) {
      throw error;
    }
    var title = '어서오세요.';
    var description = 'SSUBOB 관리자 페이지 입니다!';
    var list = template.list(shops);
    var html = template.HTML(title, list,
      `
          <h2>${title}</h2>${description}
          <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
          `,
      `
          <a href="/shop/create">가게추가 | </a>
          <a href="/cus/manage">회원관리</a>
          `,
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response)
    );
    response.send(html);
  })
});


router.get('/create', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  db.query(`SELECT * FROM shop`, function (error, shops) {
    var title = 'create';
    var list = template.list(shops);
    var html = template.HTML(title, list, `
        <form action="/shop/create_process" method="post">
          <p><input type="text" name="shop_name" placeholder="가게이름"></p>
          <p><input type="text" name="shopkeeper" placeholder="성함"></p>
          <p><input type="number" name="shop_ph" placeholder="전화번호"></p>
          <p>
            <textarea name="locate" placeholder="주소"></textarea>
          </p>
          <p><input type="number" name="quantity" placeholder="음식개수"></p>
          <p><input type="text" name="food_name" placeholder="음식이름"></p>
          <p><input type="number" name="price" placeholder="가격"></p>
          <p>
              <textarea name="description" placeholder="설명"></textarea>
          </p>
          <p>
            <input type="submit" value="가게추가">
          </p>
        </form>
        `,
      `<a href="/shop/create">가게추가</a>`, '',
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response));
    response.send(html);
  });
});

router.post('/create_process', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var post = request.body;
  db.query(`
    INSERT INTO shop (shop_name, shopkeeper, shop_ph, locate, quantity, holiday) 
      VALUES(?, ?, ?, ?, ?, 0)`,
    [post.shop_name, post.shopkeeper, post.shop_ph, post.locate, post.quantity],
    function (error, result) {
      if (error) {
        throw error;
      }
    }
  );
  db.query(`SELECT*FROM shop WHERE shop_name=?`, [post.shop_name],
    function (error2, result2) {
      db.query(`INSERT INTO menu (food_name, price, description, shop_id) 
      VALUES(?, ?, ?, ?)`,
        [post.food_name, post.price, post.description, result2[0].shop_id],
        function (error3, result3) {
          if (error3) {
            throw error3;
          }
          response.redirect(`/shop/${result2[0].shop_name}`);
        });
    }
  )
});

router.post('/delete_process', function (request, response) {
  if (cusLogin.no_administrator(request, response)) {
    return;
  };
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  db.query(`
                DELETE FROM menu WHERE shop_id=?`,
    [filteredId],
    function (error1, result) {
      if (error1) {
        throw error1;
      }
    });
  db.query(`DELETE FROM shop WHERE shop_id=?`, [filteredId], function (error, result) {
    if (error) {
      throw error;
    }
    response.redirect('/shop');
  });
});

router.get('/update/:pageId', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var filteredId = path.parse(request.params.pageId).base;
  db.query('SELECT * FROM shop', function (error, shops) {
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM shop WHERE shop_name=?`, [filteredId], function (error2, shop) {
      if (error2) {
        throw error2;
      }
      var list = template.list(shops);
      var html = template.HTML(sanitizeHTML(shop[0].shop_name), list,
        `
              <form action="/shop/update_process" method="post">
                <input type="hidden" name="id" value="${shop[0].shop_id}">
                <p><input type="text" name="shop_name" placeholder="가게이름" value="${sanitizeHTML(shop[0].shop_name)}"></p>
                <p><input type="text" name="shopkeeper" placeholder="성함" value="${sanitizeHTML(shop[0].shopkeeper)}"></p>
                <p><input type="number" name="shop_ph" placeholder="전화번호" value="${sanitizeHTML(shop[0].shop_ph)}"></p>
                <p><input type="number" name="quantity" placeholder="개수" value="${sanitizeHTML(shop[0].quantity)}"></p>
                <p><input type="number" name="holiday" placeholder="휴무여부" value="${sanitizeHTML(shop[0].holiday)}"> 휴무 : 1, 영업중 : 0</p>
                <p>
                  <textarea name="locate" placeholder="주소">${sanitizeHTML(shop[0].locate)}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
        `<a href="/shop/create">가게추가</a> <a href="/shop/update_process">가게변경</a>`,
        cusLogin.cusStatusUI(request, response),
        cusLogin.adminStatus(request, response)
      );
      response.send(html);
    });
  });
});

router.post('/update_process', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var post = request.body;
  var title = post.shop_name;
  db.query(`UPDATE shop SET shop_name=?, shopkeeper=?, shop_ph=?, locate=?, quantity=?, holiday=? WHERE shop_id=?`, [post.shop_name, post.shopkeeper, post.shop_ph, post.locate, post.quantity, post.holiday, post.id], function (error, result) {
    if (error) {
      throw error;
    }
    response.redirect(`/shop/${title}`);
  })
});



router.get('/:pageId', function (request, response, next) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var filteredId = path.parse(request.params.pageId).base;
  db.query(`SELECT * FROM shop`, function (err, shops) {
    if (err) {
      next(err);
    }
    db.query(`SELECT * FROM shop LEFT JOIN menu ON shop.shop_id=menu.shop_id LEFT JOIN menu_category ON shop.shop_id=menu_category.shop_id WHERE shop_name=?`, [filteredId], function (error2, shop) {
      if (error2) {
        throw error2;
      } else {}
      db.query(`SELECT *FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE shop_name=?`,[filteredId], function(error3, menu){
        var title = shop[0].shop_name;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(shop[0].description, {
          allowedTags: ['h1']
        });
        var price = sanitizeHtml(shop[0].price, {
          allowedTags: ['h1']
        });
        if (shop[0].holiday === 0) {
          holiday = '영업중';
        } else {
          holiday = '휴무';
        }
        var tag = '';
        var i = 0;
        var category = [];
        while (i < shop.length) {
          if (category.indexOf(shop[i].menu_category_description) === -1) {
            tag += `<option value="${shop[i].menu_category_id}">${sanitizeHTML(shop[i].menu_category_description)}</option>`;
            category.push(shop[i].menu_category_description)
            i++;
          }
          else{
            i++;
          }
        }
        var list = template.list(shops);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>
              <style>
                #file{
                  border:2px solid blue;
                  border-collapse: collapse;
                }
              </style>
              <p><form id="file" enctype="multipart/form-data" method="post" action="/shop/upload_receiver/${shop[0].shop_id}">
              <input type="file" name="userfile">
              <input type="submit">
              </form></p>
              <a id="file" href="/shop/picture/${shop[0].shop_id}">사진확인</a>
              <a id="file" href="/shop/picture/delete/${shop[0].shop_id}">사진삭제</a>
              <p>주인 : ${shop[0].shopkeeper}</p>
              <p>전화번호 : ${shop[0].shop_ph}</p>
              <p>위치 : ${shop[0].locate}</p>
              <p>개수 : ${shop[0].quantity}</p>
              <p>휴무여부 : ${holiday}</p>
              <p><a href="/menu/category/create/${shop[0].shop_id}">카테고리추가</a></p>
              <a href="/menu/category/${shop[0].shop_id}">카테고리보기</a>
              <p><h2>메뉴</h2></p>
              ${template.menuTable(menu)}
                  <style>
                      table{
                          border-collapse:collapse;
                      }
                      td{
                          border:1px solid black;
                      }
                  </style>
                  <form action="/menu/create_process" method="post">
                      <p><input type="text" name="food_name" placeholder="음식이름"></p>
                      <p><input type="number" name="price" placeholder="가격"></p>
                      <p>
                          <textarea name="description" placeholder="설명"></textarea>
                      </p>
                      <select name="category">
                      ${tag}
                      </select>
                      <p>
                          ${template.shopSelect(shops, shop[0].shop_name)}
                      </p>
                      
                      <p>
                          <input type="submit" value="메뉴추가">
                      </p>
                  </form>
                  `,
          ` <a href="/shop/create">가게추가 | </a>
            <a href="/shop/update/${sanitizedTitle}">가게변경 | </a>
            <form action="/shop/delete_process" method="post">
              <input type="hidden" name="id" value="${shop[0].shop_id}">
              <input type="submit" value="가게삭제">
            </form>`,
          cusLogin.cusStatusUI(request, response),
          cusLogin.adminStatus(request, response)
        );
        response.send(html);
      })
      })
      

  });
});

router.post('/upload_receiver/:pageId', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var filteredId = path.parse(request.params.pageId).base;
  var form = new formidable.IncomingForm();
  db.query(`SELECT*FROM shop WHERE shop_id=?`, [filteredId], function (err1, shop) {
    form.parse(request, function (err, fields, files) {
      var dt = new Date();
      var d = dt.toFormat('YYMMDDHH24');
      var s3 = new AWS.S3();
      var params = {
        Bucket: 'ssubobnodejs/images/shop',
        Key: +d + `_${shop[0].shop_name}_` + files.userfile.name,
        ACL: 'public-read',
        Body: require('fs').createReadStream(files.userfile.path)
      }
      s3.upload(params, function (err, data) {
        var result = '';
        if (err)
          result = 'Fail';
        db.query(`INSERT INTO shop_img (img_name, img_url, shop_id) VALUES(?, ?, ?)`, [params.Key, data.Location, filteredId], function (err, result) {
          response.redirect(`${request.headers.referer}`);
        })
      });
    });
  })
});

router.get('/picture/:pageId', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var filteredId = path.parse(request.params.pageId).base;
  db.query(`SELECT*FROM shop LEFT JOIN shop_img ON shop.shop_id=shop_img.shop_id WHERE shop.shop_id=?`, [filteredId], function (err, shop) {
    if (err)
      throw err
    var html = template.picture(shop, request)
    var html = template.picture(shop, request)
    response.send(html)
  })
})

router.get('/picture/delete/:pageId', function (request, response) {
  if (cusLogin.no_admin(request, response)) {
    return;
  };
  var filteredId = path.parse(request.params.pageId).base;
  db.query(`SELECT*FROM shop_img WHERE shop_id=?`, [filteredId], function (err1, shop_img) {
    var s3 = new AWS.S3();
    var key = shop_img[0].img_name;
    var params = {
      Bucket: 'ssubobnodejs/images/shop',
      Key: key
    };
    s3.deleteObject(params, function (err2, data, next) {
      if (err2) {
        throw err2
      }
    })
    db.query(`DELETE FROM shop_img WHERE shop_id=?`, [filteredId], function (err2, shop_img) {
      if (err2)
        throw error2
      response.redirect(`${request.headers.referer}`);
    })
  })
})

module.exports = router;