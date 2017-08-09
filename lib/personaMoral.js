'use strict'
const numberToWord = require('./numberToWord');

/**
 * 
 * @param {any} data 
 */
const generarRFC = (data) => {
    let rfcLetras = data.razonSocial.toUpperCase();
    let rfcNumero = generarNumeros(data.fechaConstitucion);
    rfcLetras = removerSociedades(rfcLetras);
    rfcLetras = separarRazonSocial(rfcLetras);
    rfcLetras = generarLetras(rfcLetras);
    return `${rfcLetras}${rfcNumero}`;
}

/**
 * Remover abreviaturas del tipo de razon social (regla 5)
 * @param {string} razonSocial 
 */
const removerSociedades = (razonSocial) => {
    const abreviaturasSoc = ['S. en N.C.', 'S. en C.', 'S. de R.L.', 'S. en C. por A.', 
                                'S.A.', 'S.A. de C.V.', 'S.N.C.', 'S.C.', 'A.C.', 'A. en P.', 
                                'S.C.L.', 'S.C.S.', ',', 'S en NC', 'S en C', 'S de RL', 
                                'S en C por A', 'SA', 'SA de CV', 'SNC', 'SC', 'AC', 'A en P', 'SCL', 'SCS'];
    const temp = abreviaturasSoc
        .map(abr => razonSocial.search(abr))
        .filter(n => n >= 0)
        .map(x => razonSocial.substr(0, x))
        .filter(x => x)
        .pop()
    razonSocial = temp ? temp : razonSocial;
    razonSocial = razonSocial.trim()
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
    const preposiciones = ['A', 'ANTE', 'BAJO', 'CABE', 'CON', 'CONTRA', 'DE', 'DESDE', 'EN', 'ENTRE', 'HACIA', 'HASTA', 'PARA', 'POR', 'SEGÚN', 'SIN', 'SO', 'SOBRE', 'TRAS', 'DURANTE', 'MEDIANTE', 'VERSUS', 'VÍA'];
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
    // Esas tres de arriba podrian quedar en una sola
    let razonSocialJunta = razonSocial.join(' ');
    conjuncionesEspacio.forEach(function (conj) {
        razonSocialJunta = razonSocialJunta.replace(conj, '');
    });
    razonSocialJunta = razonSocialJunta.trim()
    razonSocial = separarRazonSocial(razonSocialJunta);

    return razonSocial;
}

/**
 * Convertir numeros albritarios a letras en cumplimiento de la regla 10
 * @param {array} razonSocial 
 */
const numeroALetra = (razonSocial) => {
    return razonSocial.map(numberToWord.arbitrarios);
}

/**
 * Convertir numeros romanos a letras en cumplimiento de la regla 10
 * @param {array} razonSocial 
 */
const numeroRomanoToArbitrario = (razonSocial) => {
    return razonSocial.map(numberToWord.romanos);
}


/**
 * Generar las tres letras para el RFC
 * @param {array} razonSocial 
 * @return {any}
 */
const generarLetras = (razonSocial) => {
    razonSocial = removerORemplazarCaracteres(razonSocial);
    razonSocial = numeroRomanoToArbitrario(razonSocial);
    razonSocial = numeroALetra(razonSocial);

    if (razonSocial.length === 1) {
        if (razonSocial[0].length === 1) { return `${razonSocial[0]}XX` }
        else if (razonSocial[0].length === 2) { return `${razonSocial[0]}X` }
        else if (razonSocial[0].length >= 3) { return `${razonSocial[0].slice(0, 3)}` }
    } 
    razonSocial = removerCiaSoc(razonSocial);
    razonSocial = removerArtPrepConj(razonSocial);
    if (razonSocial.length === 1) {
        return generarLetras(razonSocial);
    } else if (razonSocial.length === 2) {
        const primeraLetra = razonSocial[0].slice(0, 1);
        if (razonSocial[1].length === 1) { return `${primeraLetra}${razonSocial[1]}X` }
        else if (razonSocial[1].length >= 3) { return `${primeraLetra}${razonSocial[1].slice(0, 2)}` }
    } else if (razonSocial.length >= 3) {
        const primeraLetra = razonSocial[0].slice(0, 1);
        const segundaLetra = razonSocial[1].slice(0, 1);
        const terceraLetra = razonSocial[2].slice(0, 1);
        return `${primeraLetra}${segundaLetra}${terceraLetra}`
    }

}

/**
 * Generar los cuatro numeros para el RFC
 * @param {Date} fechaConstitucion 
 * @return {any}
 */

// date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

const generarNumeros = (fechaConstitucion) => {
    const año = fechaConstitucion.getFullYear().toString().slice(-2);
    const mes = ('0' + (fechaConstitucion.getMonth() + 1)).slice(-2)
    const dia = ('0' + fechaConstitucion.getUTCDate()).slice(-2);

    return `${año}${mes}${dia}`;
}



module.exports = {
    generarRFC
};