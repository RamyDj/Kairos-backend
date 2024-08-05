const mongoose = require('mongoose');

//clé étrangère de la collection searches champs status_general
const status_infosSchema = mongoose.Schema({
  status_id: {type: mongoose.Schema.Types.ObjectId, ref: 'status'},
  presentation: String,
  pocedures: String,
  advantages: String,
  disadvantages: String,
  links: [String]
});

const Status_infos = mongoose.model('status_infos', status_infosSchema);

module.exports = Status_infos;