'use strict';
var sql = require('./db.js');

var User = function(user) {
    this.user_name = user.user_name;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.user_init = user.user_init;
    this.password = user.password;
    this.email = user.email;
}

User.updateUser = function updateUser(userId, user, result) {
    sql.query('UPDATE users SET ' +
    'user_name = ?, ' + 
    'first_name = ?, ' +
    'last_name = ?, ' +
    'email = ?, ' +
    'password = sha2(concat(password_salt,?),256) ' +
    'WHERE user_id = ?', [
        user.user_name,
        user.first_name,
        user.last_name,
        user.email,
        user.password, 
        userId], function(err, res){
        if(err) result(null, 'FAILURE');
        else {
            if(res.affectedRows == 1) {
                result(null, 'SUCCESS');
            } else {
                result(null, 'FAILURE')
            }
        }
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
    sql.query('SELECT user_id, user_name, first_name, last_name, user_inits, email, password ' +
        'FROM users ' +
        'WHERE (LOWER(user_name) = ? OR email = ?) ' +
        'AND sha2(concat(password_salt,?),256) = password', [userPass.user_name.toLowerCase(), userPass.user_name, userPass.password], function(err, res) {
        if(err) result(err, null);
        else result(null,res);
    })
};

User.standings = function standings(season, result) {
    sql.query(
        'select rank() over(order by wins desc, tie_breaks desc) as ranking, results.* ' +
        'from ' + 
        '(select season, r.user_id, u.user_inits, user_name, sum(wins) as wins, sum(picks) as picks, round(sum(wins)/sum(picks),3) as win_pct, sum(tie_breaks) as tie_breaks, sum(bonus_amt) as bonus_amt ' +
        'from rpt_weekly_user_stats r, users u ' +
        'where r.user_id = u.user_id ' +
        'and week <= 17 ' +
        'group by season, u.user_id ' +
        'order by season, wins desc, tie_breaks desc, win_pct desc, user_inits) as results', season, function(err, res) {
            if(err) result(err, null);
            else result(null, res)
        });
};

User.standingsByUser = function standingsByUser(season, user, result) {
    sql.query(
        'SELECT r.user_id, u.user_inits, user_name, first_name, last_name, sum(wins) as wins, sum(picks) as picks, round(sum(wins)/sum(picks),3) as win_pct ' +
        'FROM rpt_weekly_user_stats r, users u ' +
        'WHERE r.user_id = u.user_id AND season = ? ' +
        'AND r.user_id = ? ' +
        'GROUP BY season, u.user_id ', [season, user.user_id], function(err, res) {
            if(err) result(err, null);
            else result(null, res)
        });
};  

module.exports = User;