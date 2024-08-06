const mongoose = require('mongoose');

//clé étrangère de la collection status_infos champs status_id
const statusSchema = mongoose.Schema({
  name: String,
  unemployement_allocation: Boolean,
  daily_indemnities: Boolean,
  acre: Boolean,
  discharged_taxes: Boolean,
  cotisation_percentage: String,
  max_ca: Number,
  employees_max: Number,
});

const Status = mongoose.model('status', statusSchema);

module.exports = Status;