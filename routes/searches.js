var express = require('express');
var router = express.Router();

const Search = require('../models/searches')

const {toWGS, convertCodeStatusToString, convertCodeEmployeesToString, convertCodeApeToString, convertInPreviousYear, convertStatusStringToCode} = require('../modules/convertingFunctions')

const moment = require('moment')

const apiKey = process.env.SIRENE_API_KEY



router.get('/newSearch/:city/:nafCode', (req, res)=>{

  const city = req.params.city
  const nafCode = req.params.nafCode

  fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret?q=activitePrincipaleUniteLegale:${nafCode} AND libelleCommuneEtablissement:${city}&nombre=10000`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${apiKey}`,
		},
	})
  .then(response=>response.json())
  .then(data=> {

    // Tri des datas pour ne garder que les établissements encore ouverts

    const actualOpenCompanies = data.etablissements.filter(e=> e.periodesEtablissement[0].etatAdministratifEtablissement !== "F")



    // Création du sous document current_companies

    const current_companies = actualOpenCompanies.map(e=>{

      // Création des coordinées si présentes, ou adresse, ou rien.

      let coordinates 

      if (e.adresseEtablissement.coordonneeLambertAbscisseEtablissement !== null && e.adresseEtablissement.coordonneeLambertAbscisseEtablissement !== "[ND]")
        {
      const companyCoordinates = toWGS(e.adresseEtablissement.coordonneeLambertAbscisseEtablissement, e.adresseEtablissement.coordonneeLambertOrdonneeEtablissement)

      coordinates = {
        latitude : companyCoordinates[0],
        longitude : companyCoordinates[1],}
      }
      else if (e.adresseEtablissement.numeroVoieEtablissement !== null && e.adresseEtablissement.numeroVoieEtablissement !== "[ND]")
      {coordinates = {
        adresse : `${e.adresseEtablissement.numeroVoieEtablissement} ${e.adresseEtablissement.typeVoieEtablissement} ${e.adresseEtablissement.libelleVoieEtablissement} ${e.adresseEtablissement.codePostalEtablissement} ${e.adresseEtablissement.libelleCommuneEtablissement}`
      }}
      else {coordinates = {localisation : "Non renseignée"}}

      // Création des champs status et employees

      const status = convertCodeStatusToString(e.uniteLegale.categorieJuridiqueUniteLegale)

      let employees

      employees = convertCodeEmployeesToString(e.uniteLegale.trancheEffectifsUniteLegale)

      let name

      if (e.uniteLegale.denominationUniteLegale !== null && e.uniteLegale.denominationUniteLegale !== "[ND]")
      {name = e.uniteLegale.denominationUniteLegale}
      else {name = 'Non renseigné'}

      e={
      name,
      status,
      creation_date : e.dateCreationEtablissement,
      employees,
      coordinates,
      }
      return e
    })
    // Sous document current_companies créé



    // Début tri des statuts

    // Enregistrement d'une liste de tous les statuts

    const allStatus = current_companies.map(e=>{
      return e.status
    })

    // Tri en fonction du nombre d'apparitions de chaque statut

    let statusAppearanceTime = allStatus.reduce((accumulator, item) => {
      if (accumulator[item]) {
        ++accumulator[item];
    } else {
        accumulator[item] = 1;
    }
    return accumulator;
    }, {})

    let arrayStatusAppearanceTime = []

    for (let status in statusAppearanceTime){
      arrayStatusAppearanceTime.push({
        status,
        companiesNumber : statusAppearanceTime[status]
      })
    }

    sortedStatusAppearences = arrayStatusAppearanceTime.sort((a,b)=>b.companiesNumber - a.companiesNumber)

    // Nombre total d'entreprises

    const totalCountOfCompanies = actualOpenCompanies.length

    // Création de la date de la recherche et mise en forme pour recherches

    const date = new Date()
    const yearForSearches = moment(date).format("YYYY")

    // Création d'une fonction pour trouver le nombre d'entreprise par année

    function getCompaniesNumber(status, year){
      const allStatusCompanies = data.etablissements.filter(e=>{

        const yearSearchedInNumber = Number(year)
        let yearToCompare = e.periodesEtablissement[0].dateDebut.slice(0,4)
        yearToCompare= Number(yearToCompare)

        let creationYearToCompare = e.dateCreationEtablissement.slice(0,4)
        creationYearToCompare = Number(creationYearToCompare)

        if (yearToCompare<=yearSearchedInNumber && e.periodesEtablissement[0].etatAdministratifEtablissement === "F"){return}

        else if (e.uniteLegale.categorieJuridiqueUniteLegale !== convertStatusStringToCode(status)){ return }

        else if (creationYearToCompare>yearSearchedInNumber)
        {return }

        else {return e}
      })
      return allStatusCompanies.length
    }

    // Création des sous-documents detail_top_status si trois statuts différents trouvés dans la recherche

    // let detail_top_status

    // if (sortedStatusAppearences.length === 3){

    // }

    const detail_top_status=[
      { status_number : 1,
        status_name : sortedStatusAppearences[0].status,
        percentage : Math.round((sortedStatusAppearences[0].companiesNumber/totalCountOfCompanies)*100),
        companies_per_year :[
          {actual_year : yearForSearches, number : sortedStatusAppearences[0].companiesNumber},
          {year_n_minus_1 : convertInPreviousYear(yearForSearches, 1),
            number : getCompaniesNumber(sortedStatusAppearences[0].status, convertInPreviousYear(yearForSearches, 1))
          },
          {year_n_minus_2 : convertInPreviousYear(yearForSearches, 2),
            number : getCompaniesNumber(sortedStatusAppearences[0].status, convertInPreviousYear(yearForSearches, 2))
          }
        ]
      },
      { status_number : 2,
        status_name : sortedStatusAppearences[1].status,
        percentage : Math.round((sortedStatusAppearences[1].companiesNumber/totalCountOfCompanies)*100),
        companies_per_year :[
          {actual_year : yearForSearches, number : sortedStatusAppearences[1].companiesNumber},
          {year_n_minus_1 : convertInPreviousYear(yearForSearches, 1),
            number : getCompaniesNumber(sortedStatusAppearences[1].status, convertInPreviousYear(yearForSearches, 1))
          },
          {year_n_minus_2 : convertInPreviousYear(yearForSearches, 2),
            number : getCompaniesNumber(sortedStatusAppearences[1].status, convertInPreviousYear(yearForSearches, 2))
          }
        ]
      },
      { status_number : 3,
        status_name : sortedStatusAppearences[2].status,
        percentage : Math.round((sortedStatusAppearences[2].companiesNumber/totalCountOfCompanies)*100),
        companies_per_year :[
          {actual_year : yearForSearches, number : sortedStatusAppearences[2].companiesNumber},
          {year_n_minus_1 : convertInPreviousYear(yearForSearches, 1),
            number : getCompaniesNumber(sortedStatusAppearences[2].status, convertInPreviousYear(yearForSearches, 1))
          },
          {year_n_minus_2 : convertInPreviousYear(yearForSearches, 2),
            number : getCompaniesNumber(sortedStatusAppearences[2].status, convertInPreviousYear(yearForSearches, 2))
          }
        ]
      },
    ]

    // Conversion du code naf en String de sa description

    const activity = convertCodeApeToString(nafCode)
    // const newSearch = {
    //   activity,
    //   area : city,
    //   date,
    //   current_companies,
    //   top_status : detail_top_status,
    //   score : Math.floor(Math.random()*101),
    // }

    // res.json({result : newSearch})

    const newSearch = new Search({
      activity,
      area : city,
      date,
      current_companies,
      top_status : detail_top_status,
      score : Math.floor(Math.random()*101),
    })

    newSearch.save().then(data=>res.json({result:data}))
  })

})

module.exports = router;
