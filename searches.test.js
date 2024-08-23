const request = require('supertest');
const app = require('./app');
const mongoose=require('mongoose')

// Test de la route /searches/newSearch en recherchant les boulangeries à Corbas (69960) petite ville choisie au hasard. 

//Sur thunderclient 8 établissement sortent en fetchant l'api SIRENE dont trois fermés (le 1er de la liste et les deux derniers).

//Toutes ont un nom sauf l'avant dernière qui est fermée et toutes ont des coordonnées lambert sauf la dernière fermée également. current_companies devrait donc comporter 5 entreprises

it('PUT /searches/newSearch', async () => {
    const res = await request(app).put('/searches/newSearch').send({
      nafCode: '10.71C',
      city: 'Corbas',
      token: true,
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result.current_companies.length).toBe(5);

   });

//Test pour vérifier qu'en cherchant des entreprises dans la culture du riz à Meudon (92190) aucun résultat n'est trouvé

it('PUT /searches/newSearch no companies', async () => {
    const res = await request(app).put('/searches/newSearch').send({
      nafCode: '01.12Z',
      city: 'Meudon',
      token: true,
    });
   
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe("Aucune entreprise trouvée pour ce type d'activité dans ce secteur.");

   });


   // Code pour fermer correctement la connexion avec mongodb après le test et éviter crash de jest
   afterAll(done => {
    mongoose.connection.close()
    done()
  })