const mongoose = require('mongoose');

//clé étrangère de la collection status_infos champs status_id
const statusSchema = mongoose.Schema({
    name: String,
    associes: String,
    registered_capital: Boolean,
    responsabitlity: String,
    taxation_of_benefits: String,
    unemployement_allocation: Boolean,
    acre: Boolean,
    daily_indemnities: Boolean,
    discharged_taxes: Boolean,
    cotisation_percentage: String,
    max_ca: String,
});

const Status = mongoose.model('status', statusSchema);

module.exports = Status;