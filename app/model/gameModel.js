'user strict';
var sql = require('./db.js');

var Game = function(game){
    this.game_id                    = game.game_id;
    this.season                     = game.season;
    this.week                       = game.week;
    this.season_game_nbr            = game.season_game_nbr;
    this.api_game_id                = game.api_game_id;
    this.start_time                 = game.start_time;
    this.away_team                  = game.away_team;
    this.home_team                  = game.home_team;
    this.home_spread                = game.home_spread;
    this.game_status                = game.game_status;
    this.away_team_score            = game.away_team_score;
    this.home_team_score            = game.home_team_score;
    this.winning_team               = game.winning_team;
    this.pick_submit_by_date        = game.submit_by_date;
    this.current_quarter            = game.current_quarter;
    this.seconds_left_in_quarter    = game.seconds_left_in_quarter;
};

Game.getGamesById = function getGamesById(listGameIds, result) {
    if(listGameIds.length > 0) {
        sql.query("Select * from games where game_id in (?) ORDER BY start_time", [listGameIds], function (err, res) {
            if(err) result(err, null);
            else result(null, res);
        });
    } else {
        result(null, []);
    }
};

module.exports= Game;