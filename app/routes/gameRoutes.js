module.exports = function(app) {
var games = require('../controller/gameController');

    app.route('/games')
        .get(games.getListGames)
        .post(games.addGame);
    
    app.route('/games/:gameId')
        .get(games.getGame)
        .put(games.updateGame)
        .delete(games.deleteGame);   
};