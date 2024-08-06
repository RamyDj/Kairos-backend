const codesStatus = require('../datas/codesJuridiquesEntreprises')
const codesEmployees = require('../datas/codesNumberOfEmployees')
const codesApe = require('../datas/codesApeActivities')

const toWGS = (x, y) => {
    const b7 = 298.257222101;
    const b8 = 1 / b7;
    const b9 = 2 * b8 - b8 * b8;
    const b10 = Math.sqrt(b9);
    const b13 = 3;
    const b14 = 700000;
    const b15 = 12655612.0499;
    const b16 = 0.725607765053267;
    const b17 = 11754255.426096;
    const delx = x - b14;
    const dely = y - b15;
    const gamma = Math.atan(-delx / dely);
    const r = Math.sqrt(delx * delx + dely * dely);
    const latiso = Math.log(b17 / r) / b16;
    const sinphiit0 = Math.tanh(latiso + b10 * Math.atanh(b10 * Math.sin(1)));
    const sinphiit1 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit0));
    const sinphiit2 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit1));
    const sinphiit3 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit2));
    const sinphiit4 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit3));
    const sinphiit5 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit4));
    const sinphiit6 = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit5));
    const longrad = gamma / b16 + b13 / 180 * Math.PI;
    const latrad = Math.asin(sinphiit6);
    const lng = longrad / Math.PI * 180;
    const lat = latrad / Math.PI * 180;
  
    return [lat, lng];
  };


  function convertCodeStatusToString(code){
    const searchedElement = codesStatus.filter(e=>e.CdElement == code)
    const designation = searchedElement[0].LbElement
    return designation
  }

  function convertStatusStringToCode(string){
    const searchedElement = codesStatus.filter(e=>e.LbElement == string)
    const code = searchedElement[0].CdElement
    return code
  }


  function convertCodeEmployeesToString(code){
    if (code===null){return 'Non renseigné'}
    else if (!codesEmployees.some(e=> e.code == code)){return 'Non renseigné'}
    else {
      const elementSearched = codesEmployees.filter(e=> e.code == code)
      return elementSearched[0].sentence
    }
  }

  function convertCodeApeToString(code){
    const searchedElement = codesApe.filter(e=>e.code == code)
    return searchedElement[0].description
  }

  function convertInPreviousYear (year, soustraction){
    numbersToChange = Number(year)
    numbersToChange-=soustraction
    numbersToChange = numbersToChange.toString()
    return numbersToChange
  }

  module.exports = {toWGS, convertCodeStatusToString, convertStatusStringToCode, convertCodeEmployeesToString, convertCodeApeToString, convertInPreviousYear}