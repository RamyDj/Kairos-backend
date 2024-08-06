const mongoose = require('mongoose');

//collection lbelements champs status_name
const lbelementsSchema = mongoose.Schema({
  status_name: [String],
});

const Lbelement = mongoose.model('lbelements', lbelementsSchema);

module.exports = Lbelement;