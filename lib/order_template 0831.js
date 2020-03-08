var sanitizeHTML = require('sanitize-html');
var db = require('../lib/db');
module.exports = {
  template: function (body) {
    return `<style>
    table{
        border-collapse:collapse;
    }
    td{
        border:1px solid black;
    }
    #image{
      width:100px;
      hight:100px;
    }
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
  <!doctype html>
  <html>
  <head>
    <title>SSUBOB</title>
    <meta charset="utf-8">
  </head>
  <body>
    ${body}
    </body>
    </html>`
  },
  menuTable: function (menu, category_list, category_id) {
    var i = 0;
    var j = 0;
    var tag = '';
    while (i < category_list.length) {
      tag += `<p><table class="menu-table"><h4>${category_list[i]}</h4>`;
      while (j < menu.length) {
        if (menu[j].menu_category_id === category_id[i]) {
          tag += `<tr>
                    <td style="cursor:pointer;" onclick="location.href='/order/${menu[j].menu_id}/option_process'"; onMouseOver="window.status=''"; onMouseOut="window.status=''";><img src="${menu[j].img_url}"></td>
                    <td style="cursor:pointer;" onclick="location.href='/order/${menu[j].menu_id}/option_process'"; onMouseOver="window.status=''"; onMouseOut="window.status=''";>${sanitizeHTML(menu[j].food_name)}</td>
                    <td style="cursor:pointer;" onclick="location.href='/order/${menu[j].menu_id}/option_process'"; onMouseOver="window.status=''"; onMouseOut="window.status=''";>${sanitizeHTML(menu[j].price)}원</td>      
                  </tr>
                `
          j++;
        } else {
          j++;
        }
      }
      tag += '</table></p>';
      j = 0;
      i++;
    }
    return tag;
  },
  option: function (salt, property1, property2, category_list1, category_list2, menu, login = `<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>`, admin = '') {
    var i = 0;
    var j = 0;
    var sum1 = 0;
    var count = 0;
    var tag1 = '';
    var check = '';
    while (i < category_list1.length) {
      tag1 += `<p><table><h3>${category_list1[i]}</h3>`;
      while (j < property1.length) {
        var plus_price1 = `추가금액 +${property1[j].option_price}원`
        if (property1[j].option_price === 0) {
          plus_price1 = `추가금액 없음`
        }
        if (property1[j].option_category_description === category_list1[i]) {
          if (count === 0) {
            check = 'checked="checked"'
          }
          count++;
          tag1 += `<input type="radio" name="${category_list1[i]}" value="${property1[j].option_description}" ${check}/>${property1[j].option_description} ${plus_price1}
                <br>
                `
          check = '';
          sum1 += property1[j].option_price
          j++;
        } else {
          j++;
        }
      }
      tag1 += '</table></p>';
      j = 0;
      i++;
      count = 0;
    }
    var i = 0;
    var j = 0;
    var sum2 = 0;
    var tag2 = '';
    while (i < category_list2.length) {
      tag2 += `<table><h3>${category_list2[i]}</h3>`;
      while (j < property2.length) {
        var plus_price2 = `추가금액 +${property2[j].option_price}원`
        if (property2[j].option_price === 0) {
          plus_price2 = `추가금액 없음`
        }
        if (property2[j].option_category_description === category_list2[i]) {
          tag2 += `<input type="checkbox" name="${category_list2[i]}" value="${property2[j].option_description}"/>${property2[j].option_description} ${plus_price2}
                <br>
                `
          sum2 += property2[j].option_price
          j++;
        } else {
          j++;
        }
      }
      tag2 += '</table>';
      j = 0;
      i++;
    }
    var body = `
    ${login}
    ${admin}
    <h1><a id="visit" href="/">SSUBOB</a></h1>
    <h2>옵션선택</h2>
    <img id="image" src="${menu[0].img_url}">
    <p>${menu[0].food_name}</p>
    <p>${menu[0].description}</p>
    <form action="/order/order_process/${salt}" method="post">
    <input type="hidden" name="주문메뉴" value="${menu[0].food_name}">
    <input type="hidden" name="가격" value="${Number(menu[0].price)+Number(sum1)+Number(sum2)}">
    ${tag1}
    ${tag2}
    <a href='/order/${menu[0].shop_name}'>뒤로가기</a>
    <input type="submit" value="주문하기">
    </form>`
    return `
        ${this.template(body)}
    `
  },
  time_table: function (shop_time) {
    var i = 0;
    var time = ``;
    while (i < (shop_time).length) {
      time += `<option value="${shop_time[i].time_id}">${sanitizeHTML(shop_time[i].take_out)}</option>`
      i++;
    }
    return `
    <select name="time_id">
    ${time}
    </select>
    `
  },
  time_select: function (shop_time, salt, request, login = `<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>`, admin = '') {
    var body = `
    ${login}
    ${admin}
    <h1><a id="visit" href="/">SSUBOB</a></h1>
    <h2>테이크아웃 시간 선택 및 요청사항</h2>
    <form action="/order/order_process/${salt}" method="post">
    ${this.time_table(shop_time)}
    <p><textarea name="requests" placeholder="요청사항"></textarea></p>
    <input type="submit" value="선택하기">
    </form>`

    return `
    ${this.template(body)}
    `
  },
  cart: function (temp_recipe, cartList, request, login = `<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>`, admin = '') {
    cartList += `<input type="checkbox" name="id" value=${temp_recipe.temp_recipe_id}></table><input type='button' value='삭제하기' onClick="cart_delete();"/></form>`
      var body = `
      <script language="javascript">
        function cart_delete(){ 
          location.href="/order/cart/delete_process";
        }
      </script>
      ${login}
      ${admin}
      <h1><a id="visit" href="/">장바구니</a></h1>
      ${cartList}`
      return `
      ${this.template(body)}
      `
  },
  cus_accept: function (cart, pay, table, filteredId, shop, login = `<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>`, admin = '') {
    var body = `
      ${login}
      ${admin}
      <h1><a id="visit" href="/">주문확인</a></h1>
      <h2>가게정보</h2>
      <table>
      <tr><td>가게 이름</td><td>${shop[0].shop_name}</td></tr>
      <tr><td>가게 위치</td><td>${shop[0].locate}</td></tr>
      <tr><td>가게 전화번호</td><td>${shop[0].shop_ph}</td></tr>
      </table>
      <h2>주문정보</h2>
      ${table}
      <br>
      <a href='/order/order_process/${filteredId}/deny'>주문취소</a>
      ${cart} 
      ${pay}
      `
    return `
          ${this.template(body)}
        `
  }
}