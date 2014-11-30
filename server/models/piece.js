var mongoose = require('mongoose'),
    pieceSchema = require('./schemas/piece');

module.exports = mongoose.model('Piece', pieceSchema);

