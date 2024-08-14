const mongoose = require('mongoose');

//clé étrangère de la collection searches champs status_general
const status_infosSchema = mongoose.Schema({

    status_code: String,
    status_id: { type: mongoose.Schema.Types.ObjectId, ref: 'status' },
    presentation: String,
    associes: String,
    registered_capital: String,
    responsability: String,
    taxation_of_benefits: String,
    social_regime: String,
    taxation: String,
    turnover_max: String,
    salaries_max: String,
    procedures: String,
    advantages: String,
    disadvantages: String,
    links: [String]
});

const Status_infos = mongoose.model('status_infos', status_infosSchema);

module.exports = Status_infos;