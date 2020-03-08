module.exports = {
    login : function (app) {
    var db = require('./db');
    var crypto = require('crypto');
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user)
    });

    passport.deserializeUser(function (cus, done) {
        db.query(`SELECT*FROM cus WHERE cus_id=?`, [cus[0].cus_id], function (err, user) {
            done(err, user[0]);
        })
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done) {
            db.query(`SELECT*FROM cus where cus_email=?`, [username],
                function (error, cus) {
                    if (error) {
                        throw error;
                    }
                    if (cus[0] === undefined) {
                        return done(null, false, {
                            message: '이메일이 올바르지 않습니다. 다시 로그인 해주세요.'
                        });
                    } else {
                        var salt = cus[0].salt;
                        var hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");
                        if (username === cus[0].cus_email && hashPassword === cus[0].cus_pwd) {
                            return done(null, cus);
                        } else {
                            return done(null, false, {
                                message: '비밀번호가 올바르지 않습니다. 다시 로그인해주세요.'
                            });
                        }
                    }
                });
        }
    ));
    return passport;
    }
}