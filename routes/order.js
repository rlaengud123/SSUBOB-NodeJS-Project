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
var order_template = require('../lib/order_template');
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var app = express()

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}))

AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();

router.get('/:pageId', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM shop LEFT JOIN menu ON shop.shop_id=menu.shop_id LEFT JOIN menu_img ON menu.menu_id=menu_img.menu_id WHERE shop.shop_name=?`, [filteredId], function (error2, shop) {
        if (error2) {
            throw error2;
        } else {

        }
        db.query(`SELECT *FROM shop LEFT JOIN menu_category ON shop.shop_id=menu_category.shop_id WHERE shop.shop_name=?`, [filteredId], function (error2, category) {
            var i = 0;
            var category_list = [];
            var category_id = [];
            while (i < category.length) {
                if (category_id.indexOf(category[i].menu_category_id) === -1) {
                    category_id.push(category[i].menu_category_id)
                    category_list.push(category[i].menu_category_description)
                    i++;
                } else {
                    i++;
                }
            }
            var title = shop[0].shop_name;
            var sanitizedTitle = sanitizeHtml(title);
            var html = template.HTML('', '',
                `<h1>${sanitizedTitle}</h1>
            <style>
              #file{
                border:2px solid blue;
                border-collapse: collapse;
              }
              .menu-table{
                width:400px;
                higth:200px;
              }
              img{
                width:150px;
                higth:150px;
              }
              td{
                width:33%;
              }
            </style>
            <p><h2>메뉴</h2></p>
            ${order_template.menuTable(shop, category_list, category_id)}
            <a href='/'>뒤로가기</a>
                <style>
                    table{
                        border-collapse:collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                `,
                ``,
                cusLogin.cusStatusUI(request, response),
                cusLogin.adminStatus(request, response)
            );
            response.send(html);
        })
    });
});


router.get('/:pageId/option_process', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM menu LEFT JOIN menu_option ON menu.menu_id=menu_option.menu_id LEFT JOIN menu_img ON menu.menu_id=menu_img.menu_id LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE menu.menu_id=?`, [filteredId], function (error, menu) {
        db.query(`SELECT *FROM menu_option_category RIGHT JOIN menu_option ON menu_option_category.option_category_id=menu_option.option_category_id WHERE menu_option_category.menu_id=?`, [filteredId], function (error2, category) {
            if (error) {
                throw error;
            } else {

            }
            var property1 = [];
            var property2 = [];
            var i = 0;
            for (i; i < category.length; i++) {
                if (category[i].option_property === 0) {
                    property1.push(category[i])
                } else {
                    property2.push(category[i])
                }
            }
            var i = 0;
            var category_list1 = [];
            while (i < property1.length) {
                if (category_list1.indexOf(property1[i].option_category_description) === -1) {
                    category_list1.push(property1[i].option_category_description)
                    i++;
                } else {
                    i++;
                }
            }
            var i = 0;
            var category_list2 = [];
            while (i < property2.length) {
                if (category_list2.indexOf(property2[i].option_category_description) === -1) {
                    category_list2.push(property2[i].option_category_description)
                    i++;
                } else {
                    i++;
                }
            }
            var salt = Math.round((new Date().valueOf() * Math.random())) + "";
            var html = order_template.option(salt, property1, property2, category_list1, category_list2, menu, cusLogin.cusStatusUI(request, response), cusLogin.adminStatus(request, response))
            response.send(html)
        })
    });
});

router.post('/:pageId/cart/cart_process', function (request, response) {
    if (cusLogin.no_login(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    var food_name = request.body['주문메뉴']
    db.query(`SELECT * FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE food_name=?`, [food_name], function (error1, menu) {
        db.query(`SELECT * FROM temp_recipe LEFT JOIN recipe_table ON temp_recipe.temp_recipe_id=recipe_table.temp_recipe_id WHERE salt=?`, [filteredId], function (error2, temp_recipe) {
            db.query(`INSERT INTO recipe (recipe_time, temp_recipe_id, cart, salt) VALUES(NOW(), ?, ?, ?)`, [temp_recipe[0].temp_recipe_id, 1, filteredId], function (error3, result) {
                response.redirect(`/order/${menu[0].shop_name}`)
            })
        })
    })

})

router.get('/cart/cartList', function (request, response) {
    db.query(`SELECT *FROM temp_recipe LEFT JOIN recipe ON temp_recipe.temp_recipe_id=recipe.temp_recipe_id WHERE temp_recipe.cus_id=? AND recipe.cart=1`,  [request.session.passport.user[0].cus_id], function(err, message){
        if (message === undefined || !message.length) {
            var html = `
                    <script>
                        alert("장바구니가 비어있습니다.");
                        window.location.href="/";
                    </script>
                    `
            response.send(html)
            return;
        }
        else{
            var cartList = ``
            db.query(`
            SELECT * FROM temp_recipe 
            LEFT JOIN recipe_table ON temp_recipe.temp_recipe_id=recipe_table.temp_recipe_id 
            LEFT JOIN menu ON temp_recipe.menu_id=menu.menu_id 
            LEFT JOIN recipe ON temp_recipe.temp_recipe_id=recipe.temp_recipe_id 
            LEFT JOIN menu_option_category ON recipe_table.option_category_id=menu_option_category.option_category_id 
            LEFT JOIN menu_option ON recipe_table.option_id=menu_option.option_id 
            WHERE temp_recipe.cus_id=? AND recipe.cart=1`, 
            [request.session.passport.user[0].cus_id], function (error1, temp_recipe) {
                cartList += `<form action='/order/cart/delete_process' method='post'><table>`
                var i = 0;
                var count = 0;
                var num = 1;
                var recipe_id = temp_recipe[i].temp_recipe_id
                var price = 0;
                var recipe = `<form action='/order/time_select' method='post'>`
                while (i < (temp_recipe).length) {
                  if (recipe_id === temp_recipe[i].temp_recipe_id) {
                    console.log(price)
                    cartList += `<tr><td>음식이름</td><td>${temp_recipe[i].food_name}</td></tr>`
                    recipe += `<input type='hidden' name='id' value=${temp_recipe[i].temp_recipe_id}>`
                    price += temp_recipe[i].recipe_price
                    cartList += `<tr><td>${temp_recipe[i].option_category_description}</td>`
                    cartList += `<td>${temp_recipe[i].option_description}</td></tr>`
                  } 
                  else {
                    cartList += `</table><input type='hidden' name='id' value=${temp_recipe[i-1].temp_recipe_id}><input type='submit' value='삭제하기'></form> <form action='/order/cart/delete_process' method='post'><table>`
                    num++;
                    price += temp_recipe[i].recipe_price
                    recipe += `<input type='hidden' name='id' value=${temp_recipe[i].temp_recipe_id}>`
                    cartList += `<tr><td>음식이름</td><td>${temp_recipe[i].food_name}</td></tr>`
                    cartList += `<tr><td>${temp_recipe[i].option_category_description}</td>`
                    cartList += `<td>${temp_recipe[i].option_description}</td></tr>`
                    var recipe_id = temp_recipe[i].temp_recipe_id
                  }
                  i++;
                }
                var html = order_template.cart(price, recipe, temp_recipe[i-1], cartList, request, cusLogin.cusStatusUI(request, response), cusLogin.adminStatus(request, response))
                response.send(html)
            })
        }
    })
})

router.post('/cart/delete_process', function (request, response) {
        db.query(`DELETE FROM temp_recipe WHERE temp_recipe_id=?`,[request.body.id], function(error, result){
            response.redirect('/order/cart/cartList');
        })
})

router.post('/time_select', function (request, response) {
    if (cusLogin.no_login(request, response)) {
        return;
    };
    db.query(`SELECT * FROM shop_time`, function (error, shop_time) {
        var html = order_template.time_select(shop_time, salt, request, cusLogin.cusStatusUI(request, response), cusLogin.adminStatus(request, response));
        response.send(html);
    })
})

router.post('/order_process/:pageId', function (request, response) {
    if (cusLogin.no_login(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM temp_recipe WHERE salt=?`, [filteredId], function (error, message) {
        if (message[0] !== undefined) {
            db.query(`DELETE FROM temp_recipe WHERE salt=?`, [filteredId], function (err2, result3) {
                var html = `
                    <script>
                        alert("주문 중 오류가 생겼습니다. 다시 주문해주세요.");
                        window.location.href="/";
                    </script>
                    `
                response.send(html)
                return;
            })
        } else {
            var table = `<table>`
            var i = 0;
            var keys = Object.keys(request.body)
            var values = Object.values(request.body)
            var cart = `<form action="/order/${filteredId}/cart/cart_process" method="post">`
            var pay = `<form action="/order/time_select" method="post">`
            while (i < keys.length) {
                if (typeof ((Object.values(values))[i]) === 'object') {
                    var j = 0;
                    while (j < ((Object.values(values))[i]).length) {
                        table += `<tr>` + `<td>` + (Object.values(keys))[i] + (j + 1) + `</td>` + `<td>` + (Object.values(values))[i][j] + `</td>` + `</tr>`
                        cart += `<input type="hidden" name="${(Object.values(keys))[i]}" value="${(Object.values(values))[i][j]}">`
                        pay += `<input type="hidden" name="${(Object.values(keys))[i]}" value="${(Object.values(values))[i][j]}">`
                        j++;
                    }
                } else {
                    table += `<tr>` + `<td>` + (Object.values(keys))[i] + `</td>` + `<td>` + (Object.values(values))[i] + `</td>` + `</tr>`
                    cart += `<input type="hidden" name="${(Object.values(keys))[i]}" value="${(Object.values(values))[i]}">`
                    pay += `<input type="hidden" name="${(Object.values(keys))[i]}" value="${(Object.values(values))[i]}">`
                }
                i++;
            }
            table += `</table>`
            cart += `<input type="submit" value="담기"></form>`
            pay += `<input type="submit" value="결제하기"></form>`

            db.query(`SELECT menu_id FROM menu WHERE food_name=?`, [request.body['주문메뉴']], function (error2, menu) {
                var keys = Object.keys(request.body)
                var values = Object.values(request.body)
                db.query(`INSERT INTO temp_recipe (menu_id, recipe_price, cus_id, salt) VALUES(?, ?, ?, ?)`, [menu[0].menu_id, values[1], request.session.passport.user[0].cus_id, filteredId], function (error6, result) {})
                db.query(`SELECT * FROM temp_recipe WHERE salt=?`, [filteredId], function (error7, temp_recipe) {
                    var i = 2;
                    while (i < keys.length) {
                        if (typeof ((Object.values(values))[i]) === 'object') {
                            var j = 0;
                            while (j < ((Object.values(values))[i]).length) {
                                db.query(`SELECT * FROM menu_option_category RIGHT JOIN menu_option ON menu_option_category.option_category_id=menu_option.option_category_id WHERE option_description=? AND menu_option.menu_id=?`, [(Object.values(values))[i][j], menu[0].menu_id], function (error3, menu_option) {
                                    db.query(`INSERT INTO recipe_table (menu_id, cus_id, option_category_id, option_id, temp_recipe_id) VALUES(?, ?, ?, ?, ?)`, [menu[0].menu_id, request.session.passport.user[0].cus_id, menu_option[0].option_category_id, menu_option[0].option_id, temp_recipe[0].temp_recipe_id], function (error5, result) {

                                    })
                                })

                                j++;
                            }
                        } else {
                            db.query(`SELECT * FROM menu_option_category RIGHT JOIN menu_option ON menu_option_category.option_category_id=menu_option.option_category_id WHERE option_description=? AND menu_option.menu_id=?`, [(Object.values(values))[i], menu[0].menu_id], function (error3, menu_option) {
                                db.query(`INSERT INTO recipe_table (menu_id, cus_id, option_category_id, option_id, temp_recipe_id) VALUES(?, ?, ?, ?, ?)`, [menu[0].menu_id, request.session.passport.user[0].cus_id, menu_option[0].option_category_id, menu_option[0].option_id, temp_recipe[0].temp_recipe_id], function (error4, result) {

                                })
                            })
                        }
                        i++;
                    }
                })
            })

            db.query(`SELECT *FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE food_name=?`, [values[0]], function (error1, shop) {
                var html = order_template.cus_accept(cart, pay, table, filteredId, shop, cusLogin.cusStatusUI(request, response), cusLogin.adminStatus(request, response))
                response.send(html)
            })
        }
    })

})

router.get('/order_process/:pageId/deny', function (request, response) {
    if (cusLogin.no_login(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`DELETE FROM temp_recipe WHERE salt=?`, [filteredId], function (error, result) {
        if (error)
            throw error
        response.redirect('/');
    })
})

router.get('/order_process/:pageId/accept', function (request, response) {
    if (cusLogin.no_login(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`UPDATE recipe SET payment_agree=1 WHERE salt=?`, [filteredId], function (error1, result) {
        db.query(`SELECT * FROM recipe LEFT JOIN temp_recipe ON recipe.temp_recipe_id=temp_recipe.temp_recipe_id WHERE recipe.salt=?`, [filteredId], function (error, recipe) {
            if (error)
                throw error
            console.log(recipe)
        })
    })
})

module.exports = router;