'use strict';
var sql = require('./db.js');

var User = function(user) {
    this.user_name = user.user_name;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.email = user.email;
}

User.getUser = function getUser(userId, result){
    sql.query('SELECT * FROM users WHERE user_id = ?', userId, function(err, res) {
        if(err) result(err, null);
        else result(null, res);
    });
};

User.updateUser = function updateUser(userId, user, result) {
    sql.query('UPDATE users SET ? WHERE user_id = ?', [user, userId], function(err, res){
        if(err) result(err, null);
        else result(null, res);
    });
};

User.deleteUser = function deleteUser(userId, result) {
    sql.query('DELETE FROM users WHERE user_id = ?', userId, function(err, res) {
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
    sql.query('SELECT * FROM users WHERE (user_name = ? OR email = ?) AND password = ?', [userPass.user_name, userPass.user_name, userPass.password], function(err, res) {
        if(err) result(err, null);
        else result(null,res);
    })
}

module.exports = User;