const posicion = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // decena, centena, millar
const posicionDv = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
const unidad = ['UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
const dv = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE',
    'DIECIOCHO', 'DIECINUEVE', 'VEINTE', 'VEINTIUNO', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO',
    'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE'];
const decena = ['DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
const centena = ['CIEN', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

/**
 * 
 * @param {any} numero 
 */
const arbitrarios = (numero) => {
    const letra = numero;
    numero = parseInt(numero);
    if (typeof numero != 'number' || numero === undefined || numero === null || Number.isNaN(numero)) {
        return letra;
    }
    let resultado = convierteNumeroLetra(numero);
    return resultado;
}

/**
 * 
 * @param {any} str 
 */
const romanos = (str) => {
    // var result = 0;
    // // the result is now a number, not a string
    // var decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    // var roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    // for (var i = 0; i <= decimal.length; i++) {
    //     while (str.indexOf(roman[i]) === 0) {
    //         //checking for the first characters in the string
    //         result += decimal[i];
    //         //adding the decimal value to our result counter
    //         str = str.replace(roman[i], '');
    //         //remove the matched Roman letter from the beginning
    //     }
    // }
    // return result;

    str.toUpperCase()
    const validator = /^M*(?:D?C{0,3}|C[MD])(?:L?X{0,3}|X[CL])(?:V?I{0,3}|I[XV])$/
    const token = /[MDLV]|C[MD]?|X[CL]?|I[XV]?/g
    const key = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }
    let num = 0
    let m;
    if (!(str && validator.test(str)))
        return str;
    while (m = token.exec(str))
        num += key[m[0]];
    return num;
}

/**
 * 
 * @param {any} numero 
 */
const convierteNumeroLetra = (numero) => {
    let l = numero.toString().length; // longitud del numero, cantidad de digitos
    let residuo = l % 3;
    let primerSegmento = parseFloat(l / 3);
    let result = '';

    if (residuo === 0) {
        result = procesaNumero(numero);
    } else {
        // calcula la primera posición, si tiene longitud 1 ó 2
        primerSegmento = primerSegmento.toString().split('.');
        primerSegmento = primerSegmento[1].substr(0, 2); // consigo únicamente los primeros dos decimales para determinar que segmento es
        primerSegmento = parseInt(primerSegmento);

        if (primerSegmento === 66) { // primer segmento, tiene un conjunto de dos números
            numero = '0' + numero.toString();
            result = procesaNumero(numero);
        } else if (primerSegmento === 33) { // primer segmento, tiene sólo un número
            numero = '00' + numero.toString();
            result = procesaNumero(numero);
        }
    }
    return result;
}

/**
 * 
 * @param {any} numero 
 */
function procesaNumero(numero) {
    let objeto = { du: null, en: null };
    let contador = 0;
    let letra = '';
    let subLetra = '';
    let ds = null;

    ds = defineSegmento(numero); // contiene arreglos: arregloNum, escalaNumerica y validaEscalaNumerica
    // implementar si el numero es si el primer segmento es diferente de cero  y los demas igual a cero
    // implementar si el primer segmento igual a 100 o diferente 123 y el ultimo segmento es 001
    (ds.arregloNum).forEach(function (elemento) {
        objeto.du = defineUnidad(elemento); // procesa el número a letra
        objeto.en = ds.escalaNumerica[contador]; // BILLONES, MILLLONES, MIL. Cada segmento de numeros (3)
        // si la descripcion en letra es UN; crear subcadena y quitar (plural)ES
        subLetra = identificaEscalaNumerica(objeto.du, objeto.en);
        if (contador === 0) { // identifica el primer segmento de 3 digitos
            letra = subLetra;
        } else {
            if (typeof objeto.du != 'undefined') {
                letra = letra + ' ' + subLetra;
            } else {
                if (ds.escalaNumerica[contador - 1] === 'MIL' && ds.validaEscalaNumerica[contador - 1] === false) {
                    letra = letra + ' ' + objeto.en;
                }
            }
        }
        contador++;
    });

    let unidad = letra.slice(-6);
    if (unidad === 'UNIDAD') {
        letra = letra.substr(0, ((letra.toString().length) - 7)); // quita la última escala numérica que es UNIDAD
    }
    return letra;
}

/**
 * 
 * @param {any} numero 
 */
const defineSegmento = (numero) => {
    let flag = 1;
    let l = numero.toString().length;
    let arregloNum = [];
    let escalaNumerica = ['MIL', 'TRILLONES', 'MIL', 'BILLONES', 'MIL', 'MILLONES', 'MIL', 'UNIDAD'];
    let esNumResultante = [];
    let validaEscalaNumerica = [];
    let subnumero = null;
    let num = '';

    for (let i = 0; i < l; i++) {
        subnumero = (numero.toString())[i];
        num = num + subnumero;
        if (flag === 3) { // define el conjunto de 3 números
            // console.log(num);
            (num === '000') ? validaEscalaNumerica.push(true) : validaEscalaNumerica.push(false);
            arregloNum.push(num);
            flag = 1;
            num = '';
        } else {
            flag++;
        }
    }
    // define la escala numérica, dependiendo de la longitud del arreglo de números
    escalaNumerica.reverse();
    for (let i = 0; i < arregloNum.length; i++) {
        esNumResultante.push(escalaNumerica[i]);
    }
    esNumResultante.reverse();
    const result = { arregloNum: arregloNum, escalaNumerica: esNumResultante, validaEscalaNumerica: validaEscalaNumerica };
    return result;
}

/**
 * 
 * @param {any} numero 
 */
const defineUnidad = (numero) => {
    numero = parseInt(numero);

    let p;
    let l = numero.toString().length;
    let sbnInteger;
    let result = '';
    // los digitos son leidos de izquierda a derecha según el conjunto de número
    let primerDigito = parseInt(numero.toString()[0]);
    let segundoDigito = parseInt(numero.toString()[1]);
    let tercerDigito = parseInt(numero.toString()[2]);

    switch (l) {
        case 1: // unidad
            p = posicion.indexOf(numero);
            result = unidad[p];
            break;
        case 2: // decena
            if (numero >= 11 && numero <= 29) {
                p = posicionDv.indexOf(numero);
                result = dv[p];
            } else if (segundoDigito === 0) {
                p = posicion.indexOf(primerDigito);
                result = decena[p];
            } else {
                p = posicion.indexOf(primerDigito);
                result = decena[p];
                p = posicion.indexOf(segundoDigito);
                result = result + ' Y ' + unidad[p];
            }
            break;
        case 3: // centena
            sbnInteger = numero.toString()[1] + numero.toString()[2];
            sbnInteger = parseInt(sbnInteger);
            if (sbnInteger >= '01' && sbnInteger <= '09') {
                result = identificaCientos(primerDigito);
                p = posicion.indexOf(tercerDigito);
                result = result + ' ' + unidad[p];
            } else if (sbnInteger >= 11 && sbnInteger <= 29) { // valido dv
                result = identificaCientos(primerDigito);
                p = posicionDv.indexOf(sbnInteger);
                result = result + ' ' + dv[p];
            } else if (parseInt(sbnInteger.toString()[1]) === 0) { // valido las decenas enteras: 20, 30 ...
                result = identificaCientos(primerDigito);
                p = posicion.indexOf(segundoDigito);
                result = result + ' ' + decena[p];
            } else if (sbnInteger == '00') { // valido las centenas enteras: 100, 200 ...
                p = posicion.indexOf(primerDigito);
                result = centena[p];
            } else {
                result = identificaCientos(primerDigito);
                p = posicion.indexOf(segundoDigito);
                result = result + ' ' + decena[p];
                p = posicion.indexOf(tercerDigito);
                result = result + ' Y ' + unidad[p];
            }
            break;
    }
    return result;
}

/**
 * 
 * @param {any} numeroEnLetra 
 * @param {any} segmentoEscalaNumerica 
 */
const identificaEscalaNumerica = (numeroEnLetra, segmentoEscalaNumerica) => {
    if (segmentoEscalaNumerica != 'UNIDAD') {
        if (numeroEnLetra === 'UN' && segmentoEscalaNumerica != 'MIL') {
            segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica.substr(0, ((segmentoEscalaNumerica.toString().length) - 2)); // recorto la terminacion ES: MILLONES = MILLON, etc
        } else if (numeroEnLetra === 'UN' && segmentoEscalaNumerica === 'MIL') {
            return segmentoEscalaNumerica;
        } else {
            segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica;
        }
    } else {
        segmentoEscalaNumerica = numeroEnLetra + ' ' + segmentoEscalaNumerica;
    }
    return segmentoEscalaNumerica;
}

/**
 * 
 * @param {any} primerDigito 
 */
const identificaCientos = (primerDigito) => {
    let p;
    let result = '';

    if (primerDigito === 1) {
        p = posicion.indexOf(primerDigito);
        result = 'CIENTO';
    } else {
        p = posicion.indexOf(primerDigito);
        result = centena[p];
    }
    return result;
}

module.exports = {
    arbitrarios,
    romanos,
}