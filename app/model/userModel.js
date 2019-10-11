'use strict';
var sql = require('./db.js');

var User = function(user) {
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

User.getUser = function getUser(userId, result){
    sql.query('SELECT * FROM users WHERE userId = ?', userId, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
};

User.updateUser = function updateUser(userId, user, result) {
    sql.query('UPDATE users SET ? WHERE userId = ?', [user, userId], function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
};

User.deleteUser = function deleteUser(userId, result) {
    sql.query('DELETE FROM users WHERE userId = ?', userId, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
};

User.createUser = function createUser(user, result) {
    sql.query('INSERT INTO users SET ?', user, function(err, res) {
        if(err) result(null, 'FAILURE');
        else result(null, 'SUCCESS');
    });
};

User.login = function login(userPass, result) {
    sql.query('SELECT * FROM users WHERE name = ? AND password = ?', [userPass.name, userPass.password], function(err, res) {
        if(err) result(err, null);
        else result(null,res);
    })
}

module.exports = User;