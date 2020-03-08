// pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon
// cd C:\Bitnami\wampstack-7.3.7-1\mysql\bin
var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression')
var helmet = require('helmet');
var AWS = require('aws-sdk');
var express = require('express');
var formidable = require('formidable');
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
var flash = require('connect-flash')

AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(compression());
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
        host : 'localhost',
        port : 3306,
        user:'root',
        password : 'dngkgk11',
        database : 'ssubob'
    })
}))
app.use(flash())

var loginPassport = require('./lib/passport').login(app)
var indexRouter = require('./routes/index');
var shopRouter = require('./routes/shop');
var menuRouter = require('./routes/menu');
var cusRouter = require('./routes/cus')(loginPassport);
var orderRouter = require('./routes/order');

app.use(helmet())

app.use('/', indexRouter);
app.use('/shop', shopRouter);
app.use('/menu', menuRouter);
app.use('/cus', cusRouter);
app.use('/order', orderRouter);

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


/*
코드
{
    진행상황:
    (
        임시 데이터베이스 생성(08-04)
        가게 별 메뉴 create 완료(08-04)
        가게와 메뉴 구분하여 따로 만들기(08-04)
        데이터베이스에서 필수적으로 필요한 column은?(08-04)
        S3와 연동 완료(08-07)
        EC2와 연동 완료(08-10)
        로그인기능 완료(08-11)
        회원가입 기능 완료(08-11)
        아이디, 비밀번호 찾기 기능 완료(08-11)
        권한기능(쿠키, 세션) 완료(08-11)
    )
    문제: 
    (

    )
    필요: 
    (
        지도에 관한 정보, 좌표변환, API등록 등 방법 필요(08-08)
        도메인 얻기, 도메인 얻어서 코드와 연동하기(고객과의 페이지 분리 필요)(08-08)
        사용자별 인터페이스 크기 받기(08-08)
    )
}

메인페이지
{
    완료:
    (
        가게 목록 구현 완료(08-04),
        가게 추가, 변경, 삭제 구현(08-04)
    )
    필요:
    (
        
    )
    문제: 
    (

    )
}

가게 상세페이지
{
    완료:
    (
        맨 처음 메뉴 보이기(08-04)
        메뉴 전부 출력하기(08-04),
        사진 추가, 확인, 삭제 구현(08-08)
    )
    필요:
    (
        
    )
    문제: 
    (
        
    )
}

메뉴
{
    완료:
    (
        가게별 메뉴 생성기능(08-04)
        데이터베이스 입력시 조건 삽입(08-04),
        메뉴 변경기능, 삭제기능 추가(08-04)
        메뉴가 전부 출력되지 않으니, 삽입 되었는지 알수가 없음(08-04),
        사진 추가, 확인, 삭제 구현(08-08)
    )

    필요:
    (
        
    )

    문제: 
    (
        아무거나 입력가능(아무것도 입력하지 않아도 되는 것이 문제)(08-04),
    )
}
*/