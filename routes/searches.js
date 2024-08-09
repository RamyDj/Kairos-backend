var express = require('express');
var router = express.Router();

const Search = require('../models/searches')
const Status_infos = require('../models/status_infos')
const User=require('../models/users')

const lbElementsList = require('../datas/lbElementsList')

const { toWGS, convertCodeStatusToString, convertCodeEmployeesToString, convertCodeApeToString, convertInPreviousYear, convertStatusStringToCode } = require('../modules/convertingFunctions')

const moment = require('moment')

const apiKey = process.env.SIRENE_API_KEY



router.put('/newSearch', async (req, res) => {

  const { city, nafCode, token, email } = req.body

  const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret?q=activitePrincipaleUniteLegale:${nafCode} AND libelleCommuneEtablissement:${city}&nombre=10000`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })
  const data = await response.json()

  // Réponse si aucune entreprise trouvée

  if (data.header.statut == 404) {
    res.json({ result: "Aucune entreprise trouvée pour ce type d'activité dans ce secteur." });
    return
  }

  // Tri des datas pour ne garder que les établissements encore ouverts

  const actualOpenCompanies = data.etablissements.filter(e => e.periodesEtablissement[0].etatAdministratifEtablissement !== "F")

  // Réponse si aucun établissement encore ouvert

  if (actualOpenCompanies.length == 0) {
    res.json({ result: "Aucune entreprise trouvée pour ce type d'activité dans ce secteur." });
    return
  }

  // Création du sous document current_companies

  const current_companies = actualOpenCompanies.map(e => {

    // Création des coordinées si présentes, ou adresse, ou rien.

    let coordinates

    if (e.adresseEtablissement.coordonneeLambertAbscisseEtablissement !== null && e.adresseEtablissement.coordonneeLambertAbscisseEtablissement !== "[ND]") {
      const companyCoordinates = toWGS(e.adresseEtablissement.coordonneeLambertAbscisseEtablissement, e.adresseEtablissement.coordonneeLambertOrdonneeEtablissement)

      coordinates = {
        latitude: companyCoordinates[0],
        longitude: companyCoordinates[1],
      }
    }
    else if (e.adresseEtablissement.numeroVoieEtablissement !== null && e.adresseEtablissement.numeroVoieEtablissement !== "[ND]") {
      coordinates = {
        adresse: `${e.adresseEtablissement.numeroVoieEtablissement} ${e.adresseEtablissement.typeVoieEtablissement} ${e.adresseEtablissement.libelleVoieEtablissement} ${e.adresseEtablissement.codePostalEtablissement} ${e.adresseEtablissement.libelleCommuneEtablissement}`
      }
    }
    else { coordinates = { localisation: "Non renseignée" } }

    // Création des champs status et employees

    const status = convertCodeStatusToString(e.uniteLegale.categorieJuridiqueUniteLegale)

    let employees

    employees = convertCodeEmployeesToString(e.uniteLegale.trancheEffectifsUniteLegale)

    let name

    //création d'un chiffre d'affaire
    let ca = (Math.random() * 99 + 1).toFixed(2); 

    if (e.uniteLegale.denominationUniteLegale !== null && e.uniteLegale.denominationUniteLegale !== "[ND]") { name = e.uniteLegale.denominationUniteLegale }
    else { name = 'Non renseigné' }

    e = {
      name,
      status,
      creation_date: e.dateCreationEtablissement,
      employees,
      coordinates,
      ca,
    }
    return e
  })
  // Sous document current_companies créé



  // Début tri des statuts

  // Enregistrement d'une liste de tous les statuts

  const allStatus = current_companies.map(e => {
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

  for (let status in statusAppearanceTime) {
    arrayStatusAppearanceTime.push({
      status,
      companiesNumber: statusAppearanceTime[status]
    })
  }

  sortedStatusAppearences = arrayStatusAppearanceTime.sort((a, b) => b.companiesNumber - a.companiesNumber)

  // Nombre total d'entreprises

  const totalCountOfCompanies = actualOpenCompanies.length

  // Création de la date de la recherche et mise en forme pour recherches

  const date = new Date()
  const yearForSearches = moment(date).format("YYYY")

  // Création d'une fonction pour trouver le nombre d'entreprise par année

  function getCompaniesNumber(status, year) {
    const allStatusCompanies = data.etablissements.filter(e => {

      const yearSearchedInNumber = Number(year)
      let yearToCompare = e.periodesEtablissement[0].dateDebut.slice(0, 4)
      yearToCompare = Number(yearToCompare)

      let creationYearToCompare = e.dateCreationEtablissement.slice(0, 4)
      creationYearToCompare = Number(creationYearToCompare)

      if (yearToCompare <= yearSearchedInNumber && e.periodesEtablissement[0].etatAdministratifEtablissement === "F") { return }

      else if (e.uniteLegale.categorieJuridiqueUniteLegale !== convertStatusStringToCode(status)) { return }

      else if (creationYearToCompare > yearSearchedInNumber) { return }

      else { return e }
    })
    return allStatusCompanies.length
  }

  // Création des sous-documents detail_top_status en fonction du nombre de status différents trouvés

  let detail_top_status = [
    {
      status_priority: 1,
      status_name: sortedStatusAppearences[0].status,
      percentage: Math.round((sortedStatusAppearences[0].companiesNumber / totalCountOfCompanies) * 100),
      companies_per_year: [
        { actual_year: yearForSearches, number: sortedStatusAppearences[0].companiesNumber },
        {
          year_n_minus_1: convertInPreviousYear(yearForSearches, 1),
          number: getCompaniesNumber(sortedStatusAppearences[0].status, convertInPreviousYear(yearForSearches, 1))
        },
        {
          year_n_minus_2: convertInPreviousYear(yearForSearches, 2),
          number: getCompaniesNumber(sortedStatusAppearences[0].status, convertInPreviousYear(yearForSearches, 2))
        }
      ]
    },]

  if (sortedStatusAppearences.length >= 2) {
    detail_top_status.push(
      {
        status_priority: 2,
        status_name: sortedStatusAppearences[1].status,
        percentage: Math.round((sortedStatusAppearences[1].companiesNumber / totalCountOfCompanies) * 100),
        companies_per_year: [
          { actual_year: yearForSearches, number: sortedStatusAppearences[1].companiesNumber },
          {
            year_n_minus_1: convertInPreviousYear(yearForSearches, 1),
            number: getCompaniesNumber(sortedStatusAppearences[1].status, convertInPreviousYear(yearForSearches, 1))
          },
          {
            year_n_minus_2: convertInPreviousYear(yearForSearches, 2),
            number: getCompaniesNumber(sortedStatusAppearences[1].status, convertInPreviousYear(yearForSearches, 2))
          }
        ]
      },
    )
  }

  if (sortedStatusAppearences.length >= 3) {
    detail_top_status.push(
      {
        status_priority: 3,
        status_name: sortedStatusAppearences[2].status,
        percentage: Math.round((sortedStatusAppearences[2].companiesNumber / totalCountOfCompanies) * 100),
        companies_per_year: [
          { actual_year: yearForSearches, number: sortedStatusAppearences[2].companiesNumber },
          {
            year_n_minus_1: convertInPreviousYear(yearForSearches, 1),
            number: getCompaniesNumber(sortedStatusAppearences[2].status, convertInPreviousYear(yearForSearches, 1))
          },
          {
            year_n_minus_2: convertInPreviousYear(yearForSearches, 2),
            number: getCompaniesNumber(sortedStatusAppearences[2].status, convertInPreviousYear(yearForSearches, 2))
          }
        ]
      },
    )
  }

  // Conversion du code naf en String de sa description

  const activity = convertCodeApeToString(nafCode)

  // Mise au bon Format de la ville (majuscule au début des mots)

  let area = city.toLocaleLowerCase()

  if (area.includes('-')) {
    area = area.split('-')
    area = area.map(e => {
      return e = e[0].toUpperCase() + e.slice(1)
    })
    area = area.join('-')
  } else {
    const firstLetter = area[0].toUpperCase()
    area = firstLetter + area.slice(1)
  }


  // Début création du champs status_general et de ses clefs étrangères

  // Récupération des différentes appellations de status

  const codes = detail_top_status.map(e => {
    const statusName = e.status_name

    const statusCode = lbElementsList.filter(f => f.status_name === statusName)
    return statusCode[0].status_code[0]
  })

  // Récupération des id correspondants aux status

  let status_general = []

  for (let e of codes) {
    const data = await Status_infos.findOne({ status_code: e })
    status_general.push(data._id)
  }


  // Enregistrement d'une nouvelle recherche en bdd

  if (!token) {
    res.json({
      result: {
        activity,
        area,
        date,
        current_companies,
        top_status: detail_top_status,
        score: Math.floor(Math.random() * 101),
      }
    })
  }

  else {
    const newSearch = new Search({
      activity,
      area,
      date,
      current_companies,
      top_status: detail_top_status,
      score: Math.floor(Math.random() * 101),
      status_general,
    })


    // Inscription de l'id de cette recherche dans le document user correspondant 
    
    const datas = await newSearch.save()

    const searchKey = await User.updateOne({email}, {$push:{searches : datas._id}})

    console.log(searchKey)
    res.json({ result: datas })

  }
})

module.exports = router;
