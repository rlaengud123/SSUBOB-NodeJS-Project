var sanitizeHTML = require('sanitize-html');
module.exports = {
  HTML: function (title, list, body, control, login = `<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>`, admin = '') {
    return `
    <!doctype html>
    <html>
    <head>
      <title>SSUBOB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <style>
      a:link{
        color:black;
      }
      a:visited{
        color:black;
      }
      a{
        text-decoration:none
      }
    </style>
    <body>
      ${login}
      ${admin}
      <h1><a id="visit" href="/">SSUBOB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (shop) {
    var list = '<ul>';
    var i = 0;
    while (i < shop.length) {
      list = list + `
      <li><a href="/shop/${shop[i].shop_name}">${shop[i].shop_name}</a><form action="/shop/delete_process" method="post"><style type="text/css">form{display:inline}</style>
      <input type="hidden" name="id" value="${shop[i].shop_id}">
      <input type="submit" value="가게삭제">
      </form></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  shopSelect: function (shops, shop_id) {
    var tag = '';
    var i = 0;
    while (i < shops.length) {
      var selected = '';
      if (shops[i].shop_name === shop_id) {
        selected = ' selected';
      }
      tag += `<option value="${shops[i].shop_id}"${selected}>${sanitizeHTML(shops[i].shop_name)}</option>`;
      i++;
    }
    return `
      <select name="shop_id">
      ${tag}
      </select>
     `
  },
  menuTable: function (menu) {
    var tag = '<table>';
    var i = 0;
    while (i < menu.length) {
      tag += `
            <tr>
                <td>${sanitizeHTML(menu[i].food_name)}</td>
                <td><a href="/menu/${menu[i].menu_id}">정보보기</td>
            </tr>
            `
      i++;
    }
    tag += '</table>';

    return tag;
  },
  picture: function (menu, request) {
    return `
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width">
      <title>JS Bin</title>
    </head>
    <body>
      <img src=${menu[0].img_url} width="300">
      <a href=${request.headers.referer}>뒤로가기</a>
    </body>
    </html>
  `
  },
  adminSelect: function (admin, admin_id) {
    var tag = '';
    var i = 0;
    while (i < admin.length) {
      var selected = '';
      if (admin[i].admin_id === admin_id) {
        selected = ' selected';
      }
      tag += `<option value="${admin[i].admin_id}"${selected}>${sanitizeHTML(admin[i].admin_id)}</option>`;
      i++;
    }
    return `
      <select name="admin_id">
      ${tag}
      </select>
     `
  },
  cusTable: function (cus) {
    var tag = '<table>';
    var i = 0;
    while (i < cus.length) {
      tag += `
            <tr>
                <td>${sanitizeHTML(cus[i].cus_id)}</td>
                <td>${sanitizeHTML(cus[i].cus_name)}</td>
                <td>${sanitizeHTML(cus[i].cus_ph)}</td>
                <td>${sanitizeHTML(cus[i].cus_email)}</td>
                <td>${sanitizeHTML(cus[i].createdAt)}</td>
                <td>${sanitizeHTML(cus[i].admin_id)}</td>
            </tr>
            `
      i++;
    }
    tag += '</table>';

    return tag;
  },
  option: function (property1, property2, category_list1, category_list2, menu) {
    var i = 0;
    var j = 0;
    var tag1 = '';
    while(i < category_list1.length){
      tag1 += `<p><table><h4>${category_list1[i]}</h4>`;
      while (j < property1.length) {
          if(property1[j].option_category_description === category_list1[i]){
          tag1 += `<tr>
                      <td>${property1[j].option_description}</td>
                      <td>추가금액 +${property1[j].option_price}원</td>
                      <td><form action="/menu/option/delete_process" method="post">
                        <input type="hidden" name="id" value="${property1[j].option_id}">
                        <input type="submit" value="옵션삭제">
                      </form></td>
                  </tr>
                `
          j++;
        }
        else{
          j++;
        }
      }
      tag1 += '</table></p>';
      j = 0;
      i++;
    }
    var i = 0;
    var j = 0;
    var tag2 = '';
    while(i < category_list2.length){
      tag2 += `<p><table><h4>${category_list2[i]}</h4>`;
      while (j < property2.length) {
          if(property2[j].option_category_description === category_list2[i]){
          tag2 += `<tr>
                      <td>${property2[j].option_description}</td>
                      <td>추가금액 +${property2[j].option_price}원</td>
                      <td><form action="/menu/option/delete_process" method="post">
                        <input type="hidden" name="id" value="${property2[j].option_id}">
                        <input type="submit" value="옵션삭제">
                      </form></td>
                  </tr>
                `
          j++;
        }
        else{
          j++;
        }
      }
      tag2 += '</table></p>';
      j = 0;
      i++;
    }
    return `
        <style>
          table{
              border-collapse:collapse;
          }
          td{
              border:1px solid black;
          }
        </style>
        <h2>옵션보기</h2>
        <h3>필수선택</h3>
        ${tag1}
        <h3>추가선택</h3>
        ${tag2}
        <a href='/menu/${menu[0].menu_id}'>뒤로가기</a>
    `
  },
  option_category: function (menu) {
    var tag1 = '<table>';
    var i = 0;

    while (i < menu.length) {
      tag1 += `
            <tr>
                <td>${menu[i].option_category_description}</td>
                <td><form action="/menu/option/category/delete_process" method="post">
                  <input type="hidden" name="id" value="${menu[i].option_category_id}">
                  <input type="submit" value="옵션삭제">
                </form></td>
            </tr>
            `
      i++;
    }
    return `
        <style>
          table{
              border-collapse:collapse;
          }
          td{
              border:1px solid black;
          }
        </style>
        <h2>옵션카테고리보기</h2>
        ${tag1}
        <a href='/menu/${menu[0].menu_id}'>뒤로가기</a>
    `
  },
  category: function (shop) {
    var tag1 = '<table>';
    var i = 0;

    while (i < shop.length) {
      tag1 += `
            <tr>
                <td>${shop[i].menu_category_description}</td>
                <td><form action="/menu/category/delete_process" method="post">
                  <input type="hidden" name="id" value="${shop[i].menu_category_id}">
                  <input type="submit" value="옵션삭제">
                </form></td>
            </tr>
            `
      i++;
    }
    return `
        <style>
          table{
              border-collapse:collapse;
          }
          td{
              border:1px solid black;
          }
        </style>
        <h2>카테고리보기</h2>
        ${tag1}
        <a href='/shop/${shop[0].shop_name}'>뒤로가기</a>
    `
  },
  menu: function (menu, category) {
    return `
    <style>
      a:link{
        color:black;
      }
      a:visited{
        color:black;
      }
      a{
        text-decoration:none
      }
    </style>
            <p>${sanitizeHTML(menu[0].food_name)}</p>
            <p>${sanitizeHTML(menu[0].description)}</p>
            <p>${sanitizeHTML(menu[0].price)}원</p>
            <p>${sanitizeHTML(category[0].menu_category_description)}</p>
            <p><a href="/menu/update/${menu[0].menu_id}">메뉴변경</a></p>
            <p><form action="/menu/delete_process" method="post">
            <input type="hidden" name="id" value="${menu[0].menu_id}">
            <input type="submit" value="메뉴삭제">
            </form></p>
            <p><form enctype="multipart/form-data" method="post" action="/menu/upload_receiver/${menu[0].menu_id}">
            <input type="file" name="userfile">
            <input type="submit">
            </form></p>
            <p><a href="/menu/picture/${menu[0].menu_id}">사진확인</a></p>
            <p><a href="/menu/picture/delete/${menu[0].menu_id}">사진삭제</a></p>
            <p><a href="/menu/option/${menu[0].menu_id}">옵션보기</a></p>
            <p><a href="/menu/option/create/${menu[0].menu_id}">옵션추가</a></p>
            <p><a href="/menu/option/category/${menu[0].menu_id}">옵션카테고리보기</a></p>
            <p><a href="/menu/option/category/create/${menu[0].menu_id}">옵션카테고리추가</a></p>
            <a href='/shop/${menu[0].shop_name}'>뒤로가기</a>
            `
  }
}
