module.exports = {
    cusLogin: function (request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    cusStatusUI: function (request, response) {
        var cusStatusUI = '<a id="visit" href="/cus/login">로그인 | </a> <a id="visit" href="/cus/sign_up">회원가입</a>'
        if (this.cusLogin(request, response)) {
            cusStatusUI = `<a id="visit" href="/cus/logout">로그아웃 | </a> <a id="visit" href="/cus/inforchange/${request.user.salt}">회원정보 변경 | </a> <a id="visit" href="/order/cart/cartList">장바구니</a>`
        }
        return cusStatusUI
    },
    cusName: function (request, response) {
        var cusName = '<h2 id="cus-first">처음 뵙겠습니다. 환영합니다.</h2>'
        if (this.cusLogin(request, response)) {
            cusName = `<h2 id="cus-name">${request.user.cus_name}님 환영합니다.</h2>`
        }
        return cusName
    },
    adminLogin: function (request, response) {
        if (request.user === undefined) {
            return false;
        }
        if (request.user.admin_id === 1 || request.user.admin_id === 2) {
            return true;
        } else {
            return false;
        }
    },
    adminStatus: function (request, response) {
        var admin = '';
        if (this.adminLogin(request, response)) {
            admin = '<a id="visit" href="/shop"> | 관리자모드</a>';
        }
        return admin
    },
    administrator: function (request, response) {
        if (request.user.admin_id === 1) {
            return true;
        } else {
            return false;
        }
    },
    blackSearch: function (pw, name = '1234', ph = '12345678910', email = '1234@5678.com') {
        if (pw.length < 5) {
            return 1;
        } else if (ph.length < 10) {
            return 2;
        } else if (name.length < 1) {
            return 3;
        } else if (email.indexOf('@') === -1 || email.indexOf('.com') === -1) {
            return 4;
        } else {
            return false;
        }
    },
    blackAnswer: function (num, response) {
        if (num === 1) {
            var html = `
              <script>
                  alert("비밀번호가 너무 짧습니다. 다시 확인해주세요.");
                  window.location.href="/cus/sign_up/";
              </script>
              `
            response.send(html)
            return true;
        } else if (num === 2) {
            var html = `
                <script>
                    alert("전화번호의 형식이 올바르지 않습니다. 다시 확인해주세요.");
                    window.location.href="/cus/sign_up/";
                </script>
                `
            response.send(html)
            return true;
        } else if (num === 3) {
            var html = `
              <script>
                  alert("이름은 공백이 될 수 없습니다. 다시 확인해주세요.");
                  window.location.href="/cus/sign_up/";
              </script>
              `
            response.send(html)
            return true;
        } else if (num === 4) {
            var html = `
              <script>
                  alert("이메일의 형식이 올바르지 않습니다. 다시 확인해주세요.");
                  window.location.href="/cus/sign_up/";
              </script>
              `
            response.send(html)
            return true;
        }
    },
    no_admin: function (request, response) {
        if (!this.adminStatus(request, response)) {
            var html = `
              <script>
                  alert("권한이 없습니다. 관리자에게 문의해주세요.");
                  window.location.href="/";
              </script>
              `
            response.send(html)
            return true;
        }
    },
    no_administrator: function (request, response) {
        if (!this.administrator(request, response)) {
            var html = `
              <script>
                  alert("권한이 없습니다. 관리자에게 문의해주세요.");
                  window.location.href="/shop";
              </script>
              `
            response.send(html)
            return true;
        }
    },
    no_login: function (request, response) {
        if (!this.cusLogin(request, response)) {
            var html = `
              <script>
                  alert("로그인이 필요합니다. 로그인 하여 주세요.");
                  window.location.href="/cus/login";
              </script>
              `
            response.send(html)
            return true;
        }
    }
}
