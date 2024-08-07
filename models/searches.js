const mongoose = require('mongoose');

//sous document champs current_companies
const current_companiesSchema = mongoose.Schema({
    name: String,
    status: String,
    creation_date: String,
    employees: String,
    // coordinates: Object,
})

//sous document detail_top_statusSchema,
const detail_top_statusSchema = mongoose.Schema({
    status_priority: Number,
    status_name: String,
    percentage: Number,
    companies_per_year: Array
        // { actual_year: String, number: Number },
        // { year_n_minus_1: String, number: Number },
        // { year_n_minus_2: String, number: Number }
    ,
})

////clé étrangère de la collection users champs searches
const searchSchema = mongoose.Schema({
    activity: String,
    area: String,
    date: Date,
    current_companies: [current_companiesSchema],
    top_status: [detail_top_statusSchema],
    score: Number,
    status_general: [{ type: mongoose.Schema.Types.ObjectId, ref: 'status_infos' }],
});

const Search = mongoose.model('searches', searchSchema);

module.exports = Search;