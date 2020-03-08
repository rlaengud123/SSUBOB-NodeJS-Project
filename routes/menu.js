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
var date = require('date-utils');
var cusLogin = require('../lib/cusLogin.js');

AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();

router.get('/:pageId', function(request,response){
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM shop LEFT JOIN menu ON shop.shop_id=menu.shop_id WHERE menu_id=?`,[filteredId], function(error1, menu){
        db.query(`SELECT * FROM menu_category WHERE menu_category_id=?`,[menu[0].menu_category_id], function(error2, category){
            var html =`
                <body>
                <h1>${menu[0].food_name} 정보</h1>
                ${template.menu(menu, category)}
                </body>
        `
        response.send(html);
        })
        
    })

})

router.post('/create_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body;
    db.query(`SELECT*FROM shop WHERE shop_id=${post.shop_id}`, function (err, result2) {
        db.query(`
    INSERT INTO menu (food_name, price, description, shop_id, menu_category_id) 
    VALUES(?, ?, ?, ?, ?)`,
            [post.food_name, post.price, post.description, post.shop_id, post.category],
            function (error, result) {
                if (error) {
                    throw error;
                }
                response.redirect(`/shop/${result2[0].shop_name}`);
            });
    })
});

router.post('/delete_process', function (request, response) {
    if (cusLogin.no_administrator(request, response)) {
        return;
    };
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    db.query(`SELECT * FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE menu.menu_id=?`, [filteredId], function (error1, shop) {
        db.query(`
        DELETE FROM menu WHERE menu_id=?`,
            [filteredId],
            function (error2, result1) {
                if (error2) {
                    throw error2;
                }
                response.redirect(`/shop/${shop[0].shop_name}`);
            }
        )
    });
});

router.get('/update/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM shop`, function (err, shops) {
        if (err) {
            next(err);
        }
        db.query(`SELECT * FROM shop LEFT JOIN menu ON shop.shop_id=menu.shop_id LEFT JOIN menu_category ON shop.shop_id=menu_category.shop_id WHERE menu_id=?`, [filteredId], function (error2, shop) {
            if (error2) {
                throw error2;
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
            var title = shop[0].shop_name;
            var sanitizedTitle = sanitizeHtml(title);
            var html = template.HTML(sanitizedTitle, '',
                `<h2>${sanitizedTitle}</h2>
                <h3>메뉴</h3>
                <form action="/menu/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${shop[0].menu_id}">
                    </p>
                    <p><input type="text" name="food_name" value="${shop[0].food_name}"></p>
                    <p><input type="number" name="price" value=${shop[0].price}></p>
                    <p>
                        <textarea name="description">${shop[0].description}</textarea>
                    </p>
                    <p>
                        ${template.shopSelect(shops, shop[0].shop_name)}
                    </p>
                    <select name="category">
                      ${tag}
                    </select>
                    <p>
                        <input type="submit" value="메뉴변경">
                    </p>
                </form>`,
                ` `,
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
    var id = post.id;
    db.query(`SELECT * FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE menu.menu_id=?`, [id],
        function (error1, shop) {
            db.query(`
            UPDATE menu SET food_name=?, description=?, price=?, shop_id=?, menu_category_id=? WHERE menu_id=?`,
                [post.food_name, post.description, post.price, post.shop_id, post.category, post.id],
                function (error, result) {
                    if (error) {
                        throw error;
                    }
                    response.redirect(`/shop/${shop[0].shop_name}`);
                });
        });

});

router.post('/upload_receiver/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    var form = new formidable.IncomingForm();
    db.query(`SELECT*FROM menu WHERE menu_id=?`, [filteredId], function (err1, menu) {
        form.parse(request, function (err, fields, files) {
            var dt = new Date();
            var d = dt.toFormat('YYMMDDHH24');
            var s3 = new AWS.S3();
            var params = {
                Bucket: 'ssubobnodejs/images/menu',
                Key: +d + `_${menu[0].food_name}_` + files.userfile.name,
                ACL: 'public-read',
                Body: require('fs').createReadStream(files.userfile.path)
            }
            s3.upload(params, function (err, data) {
                var result = '';
                if (err)
                    result = 'Fail';
                db.query(`INSERT INTO menu_img (img_name, img_url, menu_id) VALUES(?, ?, ?)`, [params.Key, data.Location, filteredId], function (err, result) {
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
    db.query(`SELECT*FROM menu LEFT JOIN menu_img ON menu.menu_id=menu_img.menu_id WHERE menu.menu_id=?`, [filteredId], function (err, menu) {
        if (err)
            throw err
        var html = template.picture(menu, request)
        response.send(html)
    })
})

router.get('/picture/delete/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu_img WHERE menu_id=?`, [filteredId], function (err1, menu_img) {
        var s3 = new AWS.S3();
        var key = menu_img[0].img_name;
        var params = {
            Bucket: 'ssubobnodejs/images/menu',
            Key: key
        };
        s3.deleteObject(params, function (err2, data, next) {
            if (err2) {
                throw err2
            }
        })
        db.query(`DELETE FROM menu_img WHERE menu_id=?`, [filteredId], function (err2, menu_img) {
            if (err2)
                throw error2
            response.redirect(`${request.headers.referer}`);
        })
    })
})

router.get('/option/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu_option LEFT JOIN menu ON menu.menu_id=menu_option.menu_id LEFT JOIN shop ON shop.shop_id=menu.shop_id WHERE menu.menu_id=?`, [filteredId], function (err, menu) {
        db.query(`SELECT *FROM menu_option_category RIGHT JOIN menu_option ON menu_option_category.option_category_id=menu_option.option_category_id WHERE menu_option_category.menu_id=?`, [filteredId], function(error2, category) {
        if (err)
            throw err
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
                }
                else{
                    i++;
                }
            }
            var i = 0;
            var category_list2 = [];
            while (i < property2.length) {
                if (category_list2.indexOf(property2[i].option_category_description) === -1) {
                    category_list2.push(property2[i].option_category_description)
                    i++;
                }
                else{
                    i++;
                }
            }
        var html = template.option(property1, property2, category_list1, category_list2, menu)

        response.send(html)
        })
        
    })
})

router.get('/option/create/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id LEFT JOIN menu_option_category ON menu.menu_id=menu_option_category.menu_id WHERE menu.menu_id=?`, [filteredId], function (err, menu) {
        if (err)
            throw err
        var title = menu[0].food_name;
        var tag = '';
        var i = 0;
        while (i < menu.length) {
            tag += `<option value="${menu[i].option_category_id}">${sanitizeHTML(menu[i].option_category_description)}</option>`;
            i++;
        }
        var html = template.HTML(title, '', `
        <h2>${title} 옵션추가</h2>
        <form action="/menu/option/create_process" method="post">
        <input type="hidden" name="id" value="${menu[0].menu_id}">
        <h3>옵션 종류 선택</h3>
        <select name="option_property">
            <option value="0">필수선택</option>
            <option value="1">추가선택</option>
        </select>
        <h3>카테고리 선택</h3>
        <select name="option_category">
        ${tag}
        </select>
        <p><input type="text" name="option_description" placeholder="옵션이름"></p>
        <p><input type="number" name="option_price" placeholder="추가가격" value=0> 추가 금액이 없을 경우 0을 입력해주세요.</p>
        <p>
            <input type="submit" value="옵션추가">
        </p>
    </form>
    <a href='/menu/${menu[0].menu_id}'>뒤로가기</a>`,
            '',
            '')
        response.send(html)
    })
})

router.post('/option/create_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`INSERT INTO menu_option (option_description, option_price, option_property, option_category_id, menu_id) VALUES(?, ?, ?, ?, ?)`, [post.option_description, post.option_price, post.option_property, post.option_category, id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

router.post('/option/delete_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`DELETE FROM menu_option WHERE option_id=?`, [id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

router.get('/option/category/create/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu LEFT JOIN shop ON menu.shop_id=shop.shop_id WHERE menu.menu_id=?`, [filteredId], function (err, menu) {
        if (err)
            throw err
        var title = menu[0].food_name;
        var html = template.HTML(title, '', `
        <h2>${title} 옵션 카테고리 추가</h2>
        <form action="/menu/option/category/create_process" method="post">
        <input type="hidden" name="id" value="${menu[0].menu_id}">
        <p><input type="text" name="category_description" placeholder="옵션카테고리이름"></p>
        <p>
            <input type="submit" value="옵션카테고리추가">
        </p>
    </form>
    <a href='/menu/${menu[0].menu_id}'>뒤로가기</a>`,
            '',
            '')
        response.send(html)
    })
})

router.post('/option/category/create_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`INSERT INTO menu_option_category (option_category_description,  menu_id) VALUES(?, ?)`, [post.category_description, id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

router.get('/option/category/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu_option_category LEFT JOIN menu ON menu.menu_id=menu_option_category.menu_id LEFT JOIN shop ON shop.shop_id=menu.shop_id WHERE menu.menu_id=?`, [filteredId], function (err, menu) {
        if (err)
            throw err
        var html = template.option_category(menu);

        response.send(html)
    })
})

router.post('/option/category/delete_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`DELETE FROM menu_option_category WHERE option_category_id=?`, [id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

router.get('/category/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM menu_category LEFT JOIN shop ON shop.shop_id=menu_category.shop_id WHERE menu_category.shop_id=?`, [filteredId], function (err, shop) {
        if (err)
            throw err
        var html = template.category(shop);

        response.send(html)
    })
})

router.get('/category/create/:pageId', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT*FROM shop WHERE shop_id=?`, [filteredId], function (err, shop) {
        if (err)
            throw err
        var title = shop[0].shop_name;
        var html = template.HTML(title, '', `
        <h2>${title} 카테고리 추가</h2>
        <form action="/menu/category/create_process" method="post">
        <input type="hidden" name="id" value="${shop[0].shop_id}">
        <p><input type="text" name="category_description" placeholder="카테고리이름"></p>
        <p>
            <input type="submit" value="카테고리추가">
        </p>
    </form>
    <a href='/shop/${shop[0].shop_name}'>뒤로가기</a>`,
            '',
            '')
        response.send(html)
    })
})

router.post('/category/create_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`INSERT INTO menu_category (menu_category_description,  shop_id) VALUES(?, ?)`, [post.category_description, id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

router.post('/category/delete_process', function (request, response) {
    if (cusLogin.no_admin(request, response)) {
        return;
    };
    var post = request.body
    var id = post.id
    db.query(`DELETE FROM menu_category WHERE menu_category_id=?`, [id], function (error, result) {
        if (error) {
            throw error;
        }
        response.redirect(`${request.headers.referer}`);
    })
})

module.exports = router;