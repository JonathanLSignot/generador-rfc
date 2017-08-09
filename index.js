'use strict';
const personaMoral = require('./lib/personaMoral'); 
const personaFisica = require('./lib/personaFisica'); 

/**
 * @param {string} razonSocial
 * @param {date} fechaConstitucion
 */
const infoPersonaMoral = {
    razonSocial: 'Tiendas Soriana SA DE CV',
    fechaConstitucion: new Date('1999-10-22')
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

console.log('infoPersonaMoral: ', infoPersonaMoral);
console.log('RFC: ', generar('moral', infoPersonaMoral));
 