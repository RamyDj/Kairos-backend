var express = require('express');
var router = express.Router();

//import des models de Schéma
require('../models/connection');
const User = require('../models/users');
const Search = require('../models/searches');
const Score = require('../models/score');
const Status_infos = require('../models/status_infos');
const Status = require('../models/status');



//Test ajout d'un nouvel utilisateur:
router.post('/user', (req, res) => {
    // 
    const newUser = new User({
        name: "Doe",
        firstname: "John",
        email: "john.doe@example.com",
        password: "password1",
        skills: "Python, SQL, JavaScript",
        last_connection: "2024-08-03",
        searches: {
            activity: "coiffeur",
            area: "Marseille",
            date: "2024-07-15",
            current_compagnies: {
                status: "Inactive",
                creation_date: "2012-07-30",
                employees: 4,
                coordinates: {
                    Lon: "5.3698",
                    Lat: "43.2965"
                }
            },
            compagnies_per_year: {
                year: 2021,
                compagnies: 15
            },
            top_status: {
                status_number: 3,
                percentage: 60.0,
                quaterly_one: 2,
                quaterly_two: 4,
                quaterly_three: 4
            },
            status_general: {
                [
                    {
                        status_id: {
                            "name": "Auto-Entrepreneur",
                            "unemployement_allocation": false,
                            "daily_indemnities": false,
                            "discharged_taxes": false,
                            "cotisation_percentage": "12.8%",
                            "max_ca": 72600,
                            "employees_max": 0
                        },
                        presentation: "Le statut d'auto-entrepreneur permet de créer facilement une entreprise individuelle en bénéficiant de formalités administratives allégées et d'un régime fiscal avantageux.",
                        procedures: "Pour devenir auto-entrepreneur, il faut s'inscrire en ligne sur le site de l'URSSAF, choisir une activité, remplir le formulaire d'inscription et fournir les pièces justificatives nécessaires.",
                        advantages: "Les avantages incluent des formalités simplifiées, un régime fiscal et social avantageux, et la possibilité de cumuler plusieurs activités.",
                        disadvantages: "Les inconvénients peuvent inclure des plafonds de chiffre d'affaires, l'absence de couverture chômage et des cotisations sociales proportionnelles au chiffre d'affaires.",
                        links: [
                            "https://www.autoentrepreneur.urssaf.fr",
                            "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23261"
                        ]
                    },
                    {
                        status_id: {
                            "name": "Société à Responsabilité Limitée (SARL)",
                            "unemployement_allocation": true,
                            "daily_indemnities": true,
                            "discharged_taxes": false,
                            "cotisation_percentage": "15.5%",
                            "max_ca": null,
                            "employees_max": null
                        },
                        presentation: "Le statut de SARL (Société à Responsabilité Limitée) est une forme juridique adaptée aux projets entrepreneuriaux de petite et moyenne envergure, offrant une responsabilité limitée aux apports.",
                        procedures: "Pour créer une SARL, il faut rédiger les statuts, déposer le capital social à la banque, publier une annonce légale, et enregistrer la société au Registre du Commerce et des Sociétés (RCS).",
                        advantages: "Les avantages incluent la responsabilité limitée des associés, une grande souplesse de gestion, et la possibilité de dissocier le patrimoine personnel du patrimoine de la société.",
                        disadvantages: "Les inconvénients incluent des formalités de création et de gestion plus complexes et coûteuses, ainsi qu'une certaine rigidité dans le fonctionnement.",
                        links: [
                            "https://www.infogreffe.fr/societes/entreprise-societe.html",
                            "https://www.service-public.fr/professionnels-entreprises/vosdroits/F31808"
                        ]
                    },
                    {
                        status_id: {
                            "name": "Société par Actions Simplifiée (SAS)",
                            "unemployement_allocation": true,
                            "daily_indemnities": true,
                            "discharged_taxes": false,
                            "cotisation_percentage": "15.5%",
                            "max_ca": null,
                            "employees_max": null
                        },
                        presentation: "Le statut de SAS (Société par Actions Simplifiée) est une forme juridique très flexible, particulièrement adaptée aux projets de grande envergure et aux levées de fonds.",
                        procedures: "Pour créer une SAS, il faut rédiger les statuts, déposer le capital social à la banque, publier une annonce légale, et enregistrer la société au Registre du Commerce et des Sociétés (RCS).",
                        advantages: "Les avantages incluent une grande liberté statutaire, la possibilité d'émettre des actions pour lever des fonds, et une responsabilité limitée aux apports.",
                        disadvantages: "Les inconvénients incluent des coûts de création et de fonctionnement plus élevés, et des obligations comptables et fiscales plus lourdes.",
                        links: [
                            "https://www.legalstart.fr/fiches-pratiques/sas/",
                            "https://www.service-public.fr/professionnels-entreprises/vosdroits/F31553"
                        ]
                    },
                    {
                        status_id: {
                            "name": "Micro-Entreprise",
                            "unemployement_allocation": false,
                            "daily_indemnities": false,
                            "discharged_taxes": false,
                            "cotisation_percentage": "22%",
                            "max_ca": 176200,
                            "employees_max": 0
                        },
                        presentation: "Le statut de micro-entreprise est un régime simplifié de l'entreprise individuelle, destiné aux entrepreneurs souhaitant exercer une activité en leur nom propre avec des formalités allégées.",
                        procedures: "Pour devenir micro-entrepreneur, il faut s'inscrire en ligne sur le site de l'URSSAF, choisir une activité, remplir le formulaire d'inscription et fournir les pièces justificatives nécessaires.",
                        advantages: "Les avantages incluent des formalités simplifiées, un régime fiscal et social avantageux, et la possibilité de cumuler plusieurs activités.",
                        disadvantages: "Les inconvénients peuvent inclure des plafonds de chiffre d'affaires, l'absence de couverture chômage et des cotisations sociales proportionnelles au chiffre d'affaires.",
                        links: [
                            "https://www.autoentrepreneur.urssaf.fr",
                            "https://www.service-public.fr/professionnels-entreprises/vosdroits/F23264"
                        ]
                    },
                    {
                        status_id: {
                            "name": "Entreprise Unipersonnelle à Responsabilité Limitée (EURL)",
                            "unemployement_allocation": true,
                            "daily_indemnities": true,
                            "discharged_taxes": false,
                            "cotisation_percentage": "15.5%",
                            "max_ca": null,
                            "employees_max": null
                        },
                        presentation: "Le statut de EURL (Entreprise Unipersonnelle à Responsabilité Limitée) est une forme de SARL avec un seul associé, offrant une responsabilité limitée aux apports.",
                        procedures: "Pour créer une EURL, il faut rédiger les statuts, déposer le capital social à la banque, publier une annonce légale, et enregistrer la société au Registre du Commerce et des Sociétés (RCS).",
                        advantages: "Les avantages incluent la responsabilité limitée aux apports, la possibilité de choisir l'impôt sur les sociétés ou l'impôt sur le revenu, et une gestion simplifiée.",
                        disadvantages: "Les inconvénients incluent des formalités de création et de gestion plus complexes que pour une entreprise individuelle, et des coûts de fonctionnement plus élevés.",
                        links: [
                            "https://www.infogreffe.fr/societes/entreprise-societe.html",
                            "https://www.service-public.fr/professionnels-entreprises/vosdroits/F31809"
                        ]
                    }
                ]
            }
        },
    });



    // Sauvegarde en bdd
    newUser.save().then(newDoc => {
        res.json({ result: true, weather: newDoc });
    });
});




module.exports = router;