module.exports = function(app) {
    var week = require('../controller/weekController');
    var picks = require('../controller/pickController');
    var users = require('../controller/userController');
    var league = require('../controller/leagueController');
    var message = require('../controller/messageController');
        
/*<---------WEEKS---------->*/
    app.route('/weeks/current')
        .get(week.getCurrentWeek);

    app.route('/weeks/season/:season/week/:week')
        .post(week.getWeek);

/*<---------PICKS----------->*/
    app.route('/picks/user/:userId/season/:season/week/:week')
        .get(picks.getUsersPicksByWeek);

    app.route('/picks/season/:season/week/:week')
        .post(picks.getPicksByWeek);

    app.route('/picks/create')
        .post(picks.addPicks);

    app.route('/picks/:id')
        .get(picks.getPick)
        .put(picks.updatePick)
        .delete(picks.deletePick);

    app.route('/picks/games/season/:season/week/:week')
        .get(picks.getWeekPicksByGame);

/*<---------USERS------------>*/
    app.route('/users/:id')
        .put(users.updateUser)
        .delete(users.deleteUser);

    app.route('/users/register')
        .post(users.createUser);

    app.route('/users/login')
        .post(users.login);

    app.route('/users/standings/:season')
        .get(users.standings)
        .post(users.standingsByUser);

/*<---------LEAGUE------------>*/
    app.route('/league/settings')
        .get(league.leagueSettings);

/*<---------MESSAGING--------->*/

    app.route('/message/announcements')
        .post(message.announcements);

};