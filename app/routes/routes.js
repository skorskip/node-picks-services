module.exports = function(app) {
    var games = require('../controller/gameController');
    var week = require('../controller/weekController');
    var teams = require('../controller/teamController');

/*<---------GAMES---------->*/
    app.route('/games')
        .get(games.getListGames)
        .post(games.addGame);
    
    app.route('/games/:gameId')
        .get(games.getGame)
        .put(games.updateGame)
        .delete(games.deleteGame);
        
/*<---------WEEKS---------->*/
    app.route('/week/current')
        .get(week.getCurrentWeek);

    app.route('/week/season/:season/week/:week')
        .get(week.getWeek);

/*<---------TEAMS---------->*/
    app.route('/teams')
        .get(teams.getAllTeams)
        .post(teams.getTeamsById);

    app.route('/teams/:teamId')
        .get(teams.getTeam);

    app.route('/teams/abbrv/:teamAbbrev')
        .get(teams.getTeamByAbbrev);
};