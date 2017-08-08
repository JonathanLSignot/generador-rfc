'use strict'
const numberToWord = require('./numberToWord'); 

/**
 * 
 * @param {any} data 
 */
const  generarRFC = (data) => {
    let rfc = data.razonSocial;
    rfc = rfc.toUpperCase();
    rfc = removerSociedades(rfc);
    rfc = separarRazonSocial(rfc);
    rfc = removerORemplazarCaracteres(rfc);
    rfc = removerCiaSoc(rfc);
    rfc = removerArtPrepConj(rfc);
    return rfc;
}

/**
 * Remover abreviaturas del tipo de razon social (regla 5)
 * @param {string} razonSocial 
 */
const removerSociedades = (razonSocial) => {
    const abreviaturasSoc = ['S. en N.C.', 'S. en C.', 'S. de R.L.', 'S. en C. por A.', 'S.A.', 'S.A. de C.V.', 'S.N.C.', 'S.C.', 'A.C.', 'A. en P.', 'S.C.L.', 'S.C.S.', ','];
    const temp = abreviaturasSoc
        .map(abr => razonSocial.search(abr))
        .filter(n => n >= 0)
        .map(x => razonSocial.substr(0, x))
        .filter(x => x)
        .pop()
    razonSocial = temp ? temp : razonSocial;
    return razonSocial;
}

/**
 * 
 * @param {string} razonSocial 
 */
const separarRazonSocial = (razonSocial) => {
    let razonSocialPorPalabra = [];
    const separador = " ";
    razonSocialPorPalabra = razonSocial.split(separador);
    return razonSocialPorPalabra;
}

//TODO: remplazar las vocales con acento por vocales sin acento

/**
 * remover o remplazar caracteres especiales en cumplimiento de la regla 12
 * @param {array} razonSocial 
 */
const removerORemplazarCaracteres = (razonSocial) => {
    const caracteresEspeciales = [
        { caracter: '@', valor: 'ARROBA' },
        { caracter: '´', valor: 'APOSTROFE' },
        { caracter: '%', valor: 'PORCIENTO' },
        { caracter: '#', valor: 'NUMERO' },
        { caracter: '!', valor: 'ADMIRACION' },
        { caracter: '.', valor: 'PUNTO' },
        { caracter: '$', valor: 'PESOS' },
        { caracter: '”', valor: 'COMILLAS' },
        { caracter: '-', valor: 'GUION' },
        { caracter: '/', valor: 'DIAGONAL' },
        { caracter: '+', valor: 'SUMA' },
        { caracter: '(', valor: 'ABRE PARENTESIS' },
        { caracter: ')', valor: 'CIERRA PARENTESIS' }
    ];
    return razonSocial.map(function (palabra) {
        palabra.length === 1 
        ? caracteresEspeciales.map(function (obj) {
            palabra = palabra === obj.caracter ? obj.valor : palabra
        }) 
        : caracteresEspeciales.map(function (obj) {
            palabra = palabra.replace(obj.caracter, '')
        })
        return palabra;
    });
}

/**
 * remover o remplazar compañia, cia, sociedad y soc en cumplimiento de la regla 11
 * @param {array} razonSocial 
 */
const removerCiaSoc = (razonSocial) => {
    const algo = ['COMPAÑIA', 'CIA', 'SOCIEDAD', 'SOC'];
    // for (let i = 0; i < razonSocial.length; i++) {
    //     let palabra = razonSocial[i];
    //     if (algo.indexOf(palabra) >= 0) {
    //         razonSocial.splice(i, 1);
    //     }
    // }
    // return razonSocial
    razonSocial.map(function (palabra, index) {
       algo.indexOf(palabra) >= 0 ? razonSocial.splice(index, 1) : palabra
    });
    return razonSocial;
}

/**
 * remover articulos, preposiciones y conjunciones en cumplimiento de la regla 9
 * @param {array} razonSocial 
 */
const removerArtPrepConj = (razonSocial) => {
    const articulos = ['EL', 'LA', 'LOS', 'LAS', 'UN', 'UNA', 'UNOS', 'UNAS', 'AL', 'DEL', 'LO'];
    const preposiciones = ['A', 'ANTE', 'BAJO', 'CABE', 'CON', 'CONTRA', 'DE', 'DESDE', 'EN', 'ENTRE', 'HACIA', 'HASTA', 'PARA', 'POR', 'SEGÚN', 'SIN', 'SO', 'SOBRE', 'TRAS', 'DURANTE', 'MEDIANTE', 'VERSUS' , 'VÍA'];
    const conjunciones = ['Y', 'E', 'NI', 'O', 'SEA', 'PERO', 'MAS', 'EMPERO', 'LUEGO', 'PUES', 'CONQUE', 'PORQUE', 'PUES', 'SI'];
    const conjuncionesEspacio = ['YA BIEN', 'SIN EMBARGO', 'ASI QUE', 'PUESTO QUE', 'YA QUE', 'CON TAL QUE', 'SIEMPRE QUE', 'AL MENOS QUE'];
    razonSocial.map(function (palabra, index) {
       articulos.indexOf(palabra) >= 0 ? razonSocial.splice(index, 1) : palabra
    });
    razonSocial.map(function (palabra, index) {
       preposiciones.indexOf(palabra) >= 0 ? razonSocial.splice(index, 1) : palabra
    });
    razonSocial.map(function (palabra, index) {
       conjunciones.indexOf(palabra) >= 0 ? razonSocial.splice(index, 1) : palabra
    });
    let razonSocialJunta = razonSocial.join(" ");
    conjuncionesEspacio.forEach(function(conj) {
        console.log('razonSocialJunta ', razonSocialJunta);
        console.log('conj ', conj);
        razonSocialJunta = razonSocialJunta.replace(conj, '');
    });
    razonSocialJunta = razonSocialJunta.replace(' ', '');
    razonSocial = separarRazonSocial(razonSocialJunta);

    return razonSocial;
}

/**
 * Convertir numeros albritarios y romanos a letras en cumplimiento de la regla 10
 * @param {array} razonSocial 
 */
const numeroALetra = (razonSocial) => {
    return razonSocial.map(numberToWord.arbitrarios);
}

module.exports = {
    generarRFC    
};