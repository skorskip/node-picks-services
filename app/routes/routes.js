module.exports = function(app) {
    var games = require('../controller/gameController');
    var week = require('../controller/weekController');
    var teams = require('../controller/teamController');
    var picks = require('../controller/pickController');
    var users = require('../controller/userController');

/*<---------GAMES---------->*/
    app.route('/games')
        .post(games.getGamesById);
    
    app.route('/games/:gameId')
        .get(games.getGame)
        .put(games.updateGame)
        .delete(games.deleteGame);
        
/*<---------WEEKS---------->*/
    app.route('/weeks/current')
        .get(week.getCurrentWeek);

    app.route('/weeks/season/:season/week/:week')
        .get(week.getWeek);

/*<---------TEAMS---------->*/
    app.route('/teams')
        .get(teams.getAllTeams)
        .post(teams.getTeamsById);

    app.route('/teams/:teamId')
        .get(teams.getTeam);

    app.route('/teams/abbrv/:teamAbbrev')
        .get(teams.getTeamByAbbrev);

/*<---------PICKS----------->*/
    app.route('/picks/user/:userId')
        .get(picks.getPicksByUser);

    app.route('/picks/user/:userId/season/:season/week/:week')
        .get(picks.getPicksByWeek);

    app.route('/picks/create')
        .post(picks.addPicks);

    app.route('/picks/:id')
        .get(picks.getPick)
        .put(picks.updatePick)
        .delete(picks.deletePick);

    app.route('/picks/game/:gameId')
        .get(picks.getPicksByGame);

/*<---------USERS------------>*/
    app.route('/users/:id')
        .put(users.updateUser)
        .delete(users.deleteUser);

    app.route('/users/register')
        .post(users.createUser);

    app.route('/users/login')
        .post(users.login);

    app.route('/users/standings/:season')
        .get(users.standings);
};