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
var crypto = require('crypto');
var cusLogin = require('../lib/cusLogin.js');

AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();


module.exports = function (loginPassport) {
  router.get('/sign_up', function (request, response) {
    var title = 'sign_up';
    var html = template.HTML(title, '', `
        <h2>회원가입</h2>
        <form action="/cus/sign_up_process" method="post">
            <p><input type="text" name="cus_name" placeholder="성함"></p>
            <p><input type="number" name="cus_ph" placeholder="전화번호"> '-' 빼고 입력하여 주세요.</p>
            <p><input type="text" name="cus_email" placeholder="이메일"> 이메일은 중복이 될 수 없습니다.</p>
            <p><input type="password" name="pwd" placeholder="비밀번호"> 5자리 이상 입력해 주세요.</p>
            <p><input type="password" name="pwd2" placeholder="비밀번호 재입력"> 비밀번호를 한번 더 입력해 주세요.</p>
            <p><input type="submit" value="회원가입"></p>
        </form>
        <form action="/">
            <input type="submit" value="취소">
        </form>
        `,
      ``, '',
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response));
    response.send(html);
  });

  router.post('/sign_up_process', function (request, response) {
    var post = request.body;
    var blackSearch = cusLogin.blackSearch(post.pwd, post.cus_name, post.cus_ph, post.cus_email);
    if (cusLogin.blackAnswer(blackSearch, response)) {
      return;
    };
    db.query(`SELECT cus_email FROM cus WHERE cus_id=?`, [post.cus_email], function (error2, email) {
      if (email[0] === undefined) {

      } else {
        var html = `
        <script>
            alert("이메일이 중복되었습니다. 다른 이메일을 사용해 주세요.");
            window.location.href="/cus/sign_up/";
        </script>
        `
        response.send(html)
        return;
      }
    })
    if (post.pwd !== post.pwd2) {
      var html = `
        <script>
            alert("비밀번호가 다릅니다. 다시 한 번 확인해 주세요.");
            window.location.href="/cus/sign_up/";
        </script>
        `
      response.send(html)
      return;
    }
    var inputPassword = post.pwd;
    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    db.query(`
      INSERT INTO cus (cus_name, cus_ph, cus_email, cus_pwd, salt, createdAt, admin_id) VALUES(?, ?, ?, ?, ?, NOW(), 3)`, [post.cus_name, post.cus_ph, post.cus_email, hashPassword, salt], function (error, cus) {
      if (error) {
        throw error;
      }
      response.redirect('/');
    });
  });

  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = '로그인';
    var html = template.HTML(title, '', `
          <h2>로그인</h2>
          <div style="color:red";>${feedback}</div>
          <form action="/cus/login_process" method="post">
            <p><input type="text" name="email" placeholder="이메일"></p>
            <p><input type="password" name="pwd" placeholder="비밀번호"></p>
            <p><input type="submit" value="로그인"></p>
          </form>
          <a href="/cus/id/find">아이디찾기 | </a>
          <a href="/cus/pwd/find">비밀번호찾기</a>
          `,
      ``, '',
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response));
    response.send(html);
  });

  router.post('/login_process',
    loginPassport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/cus/login',
      failureFlash: true
    })
  );

  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {
      response.redirect('/');
    })
  });

  router.get('/pwd/find', function (request, response) {
    var title = '비밀번호 찾기';
    var html = template.HTML(title, '비밀번호 찾기', `
          <form action="/cus/pwd/find_process" method="post">
            <p><input type="text" name="cus_name" placeholder="이름"></p>
            <p><input type="number" name="cus_ph" placeholder="전화번호"></p>
            <p><input type="text" name="cus_email" placeholder="이메일"></p>
            <p><input type="submit" value="비밀번호 찾기"></p>
          </form>
          `,
      ``, '',
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response));
    response.send(html);
  });

  router.post('/pwd/find_process', function (request, response) {
    var post = request.body;
    db.query(`SELECT*FROM cus WHERE cus_name=? AND cus_ph=? AND cus_email=?`, [post.cus_name, post.cus_ph, post.cus_email], function (err, result, next) {
      if (result[0] === undefined) {
        var html = `
      <script>
          alert("입력하신 정보가 옳바르지 않습니다. 다시 입력해 주세요");
          window.location.href="/cus/pwd/find/";
      </script>
      `
        response.send(html)
        return;
      } else {
        var title = '비밀번호 찾기';
        var html = template.HTML(title, '비밀번호 찾기', `
          <form action="/cus/pwd/change_process/${result[0].salt}" method="post">
            <p><input type="password" name="cus_pwd" placeholder="비밀번호"></p>
            <p><input type="password" name="cus_pwd2" placeholder="비밀번호 재입력"> 비밀번호를 한번 더 입력해주세요.</p>
            <p><input type="submit" value="비밀번호 변경"></p>
          </form>
          `,
          ``, '',
          cusLogin.cusStatusUI(request, response),
          cusLogin.adminStatus(request, response));
        response.send(html);
      }
    })
  });

  router.post('/pwd/change_process/:pageId', function (request, response) {
    var post = request.body;
    if (post.cus_pwd.length < 5) {
      var html = `
              <script>
                  alert("비밀번호가 너무 짧습니다. 다시 확인해주세요.");
                  window.location.href="/cus/pwd/find";
              </script>
              `
      response.send(html)
      return;
    }
    var filteredId = path.parse(request.params.pageId).base;
    if (post.cus_pwd !== post.cus_pwd2) {
      var html = `
        <script>
            alert("비밀번호가 다릅니다. 다시 한 번 확인해 주세요.");
            window.location.href="/cus/pwd/find";
        </script>
        `
      response.send(html)
      return;
    }
    var inputPassword = post.cus_pwd;
    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    db.query(`
  UPDATE cus SET cus_pwd=?, salt=? WHERE salt=?`, [hashPassword, salt, filteredId], function (error, cus) {
      if (error) {
        throw error;
      }
      var html = `
        <script>
            alert("비밀번호가 변경되었습니다! ");
            window.location.href="/cus/login";
        </script>
        `
      response.send(html)
      return;
    });
  });

  router.get('/id/find', function (request, response) {
    var title = '아이디 찾기';
    var html = template.HTML(title, '아이디 찾기', `
          <form action="/cus/id/find_process" method="post">
            <p><input type="text" name="cus_name" placeholder="이름"></p>
            <p><input type="number" name="cus_ph" placeholder="전화번호"></p>
            <p><input type="submit" value="아이디 찾기"></p>
          </form>
          `,
      ``, '',
      cusLogin.cusStatusUI(request, response),
      cusLogin.adminStatus(request, response));
    response.send(html);
  });

  router.post('/id/find_process', function (request, response) {
    var post = request.body;
    db.query(`SELECT*FROM cus WHERE cus_name=? AND cus_ph=?`, [post.cus_name, post.cus_ph], function (err, result, next) {
      if (result[0] === undefined) {
        var html = `
      <script>
          alert("입력하신 정보가 올바르지 않습니다. 다시 입력해 주세요");
          window.location.href="/cus/id/find/";
      </script>
      `
        response.send(html)
        return;
      } else {
        var title = '아이디 찾기';
        var email = result[0].cus_email;
        var html = template.HTML(title, '아이디 찾기', `
          <p>고객님의 아이디는 '${email}' 입니다.</p>
          <a href="/cus/login">로그인하기</a>
          <a href="/cus/pwd/find">비밀번호찾기</a>
          `,
          ``, '',
          cusLogin.cusStatusUI(request, response),
          cusLogin.adminStatus(request, response));
        response.send(html);
      }
    })
  });

  router.get('/manage', function (request, response) {
    cusLogin.no_administrator(request, response);
    db.query(`SELECT*FROM cus`, function (err, cus) {
      db.query(`SELECT*FROM admin`, function (err, admin) {
        var title = '회원관리';
        var html = template.HTML(title, '회원관리', `
        ${template.cusTable(cus, admin)}
        <style>
          table{
              border-collapse:collapse;
          }
          td{
              border:1px solid black;
          }
          </style>
          <a href="${request.headers.referer}">뒤로가기</a>
        `,
          ``, '',
          cusLogin.cusStatusUI(request, response),
          cusLogin.adminStatus(request, response));
        response.send(html);
      });
    })
  });

  router.get('/inforchange/:pageId', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    db.query(`SELECT * FROM cus WHERE salt=?`, [filteredId], function (error2, cus) {
      if (error2) {
        throw error2;
      }
      var html = template.HTML(sanitizeHTML(cus[0].cus_name), '',
        `       <h2>회원정보 변경</h2>
                <form action="/cus/inforchange_process" method="post">
                  <input type="hidden" name="cus_id" value="${cus[0].cus_id}">
                  <style>
                    table{
                        border-collapse:collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                    #pwd{
                      font-size:20px;
                      font-weight:bold
                    }
                </style>
                  <tr>
                    <p>
                      <td>성함 : </td>
                      <td><a>${cus[0].cus_name}</a></td>
                    </p>
                    <p>
                      <td>이메일 : </td>
                      <td><a>${cus[0].cus_email}</a></td>
                    </p>
                    <p>
                      <td>전화번호 : </td>
                      <td><input type="number" name="cus_ph" placeholder="전화번호" value="${sanitizeHTML(cus[0].cus_ph)}"></td>
                    </p>
                    <p id="pwd">비밀번호 변경</p>
                    <p>
                      <td><input type="password" name="cus_pwd" placeholder="비밀번호"></td>
                    </p>
                    <p>
                      <td><input type="password" name="cus_pwd2" placeholder="비밀번호 재 확인"></td>
                    </p>
                  </tr>
                  <p>
                    <input type="submit" value="변경">
                  </p>
                </form>
                `,
        ``,
        cusLogin.cusStatusUI(request, response),
        cusLogin.adminStatus(request, response)
      );
      response.send(html);
    });
  });

  router.post('/inforchange_process', function (request, response) {
    var post = request.body;
    if (post.cus_pwd.length < 5) {
      var html = `
              <script>
                  alert("비밀번호가 너무 짧습니다. 다시 확인해주세요.");
                  window.location.href="${request.headers.referer}";
              </script>
              `
      response.send(html)
      return;
    }
    if (post.cus_pwd !== post.cus_pwd2) {
      var html = `
        <script>
            alert("비밀번호가 다릅니다. 다시 한 번 확인해 주세요.");
            window.location.href="${request.headers.referer}";
        </script>
        `
      response.send(html)
      return;
    }
    var inputPassword = post.cus_pwd;
    var salt = Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    db.query(`
      UPDATE cus SET cus_pwd=?, salt=?, cus_ph=? WHERE cus_id=?`, [hashPassword, salt, post.cus_ph, post.cus_id], function (error, cus) {
      if (error) {
        throw error;
      }
      var html = `
        <script>
            alert("정보가 변경되었습니다! ");
            window.location.href="/";
        </script>
        `
      response.send(html)
      return;
    });
  });

  return router;
}
