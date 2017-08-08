'use strict';
const personaMoral = require('./lib/personaMoral'); 
const personaFisica = require('./lib/personaFisica'); 

const infoPersonaMoral = {
    razonSocial: 'cia. 13 el ARROZ @ C@FE ALGO, S. en N.C.',
    fechaConstitucion: new Date()
}
/**
 * 
 * @param {string} tipo 
 * @param {any} data 
 */
const  generar = (tipo, data) =>
    tipo === 'moral' ? personaMoral.generarRFC(data) :
    tipo === 'fisica' ? personaFisica.generarRFC(data) :
    `${tipo} no es tipo de persona valido. indique si es moral o fisica`

console.log(generar('moral', infoPersonaMoral));
 