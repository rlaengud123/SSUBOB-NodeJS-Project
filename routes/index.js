var express = require('express')
var router = express.Router()
var template = require('../lib/template.js');
var cusLogin = require('../lib/cusLogin.js');
var db = require('../lib/db');
var main_template = require('../lib/main_template');
require('date-utils');

router.get('/', function (request, response, next) {
    db.query(`SELECT * FROM shop LEFT JOIN shop_img ON shop.shop_id=shop_img.shop_id`, function (error, shops) {
        if (error) {
            throw error;
        }
        db.query(`SELECT TIME_FORMAT(take_out, "%H시 %i분") AS take_out FROM shop_time ORDER BY take_out`, function (error2, time2) {
            db.query(`SELECT TIME_FORMAT(take_out, "%H시 %i분") AS take_out FROM shop_time WHERE take_out > NOW() ORDER BY take_out`, function (error, time) {
                if (time.length === 0) {
                    time = time2;
                }
                var title = 'SSUBOB';
                var list = main_template.list(shops, time)
                var html = main_template.HTML(title, list,
                    cusLogin.cusStatusUI(request, response),
                    cusLogin.cusName(request, response),
                    cusLogin.adminStatus(request, response)
                );
                response.send(html);
            })
        })
    })
});

/* router.get('/', function (request, response) {
    db.query(`SELECT * FROM shop`, function (error, shops) {
        if (error) {
            throw error;
        }
        var title = '어서오세요.';
        var description = 'SSUBOB입니다!';
        var html = template.HTML(title, '',
            `
            <h2>${title}</h2>${description}
            <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
            `,
            ``,
            cusLogin.cusStatusUI(request, response),
            cusLogin.adminStatus(request, response)
        );
        response.send(html);
    })
}); */

module.exports = router;