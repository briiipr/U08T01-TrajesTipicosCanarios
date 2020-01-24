import { islasTrajes } from './data.js';
let listaTrajes = islasTrajes;
var arrayDificultades = ['Fácil', 'Medio', 'Experto'];
var arrayAreas = [4, 6, 8]
var arrayNIslas = [4, 7];
var arrayNombreIslas = new Array();
var nIslas = 0;
var dificultadActual = 0;
var puntuacionActual = 0;
var arrayErrores = [5, 8, 9];
var nErrores = 0;
var indiceError;

/*
    Al cargar el documento, se agregan los botones de dificultades y sus eventos, así como 
    las opciones del modal y se rellena el array de trajes disponibles.

    Está hecho para que funcione independientemente del número de imágenes o los parámetros de dificultad, que solo
    se cambian arriba en la declaración.
*/
$(document).ready(function () {
    $('#divBotones');
    arrayDificultades.forEach(function (valor, iterador) {
        $('#divBotones').append(`<button value=${arrayAreas[iterador]}>${valor}</button>`)
    })
    $('#divBotones').children().each(function () {
        $(this).button().click(cambiaDificultad);
    });

    listaTrajes.forEach(function (x) {
        if (arrayNombreIslas.indexOf(x.nombreIsla) === -1) {
            arrayNombreIslas.push(x.nombreIsla);
        }
    });

    $("#modal").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 1000
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
    });
    console.log(arrayNombreIslas);
})

/*
    Actualiza la dificultad a la que ha hecho click el usuario, se muestran
    tanto el número de errores máximos (establecidos por mí), como el número de aciertos máximos, 
    en base a la dificultad escogida.
 */
function cambiaDificultad() {
    $('#puntuacion').text(puntuacionActual);
    $('#errores').text(nErrores);
    $('#puntuacion').parent().slideDown();
    $('#errores').parent().slideDown();
    dificultadActual = $(this).val();
    indiceError = arrayAreas.indexOf(parseInt(dificultadActual));
    $('#erroresDificultad').text(arrayErrores[indiceError]);
    $('#puntuacionDificultad').text(dificultadActual);
    actualizaDiv();
}

/*
    Evita que queden restos de otras dificultades o intentos, además agrega
    las islas de forma aleatoria, y los trajes en consecuencia a las mismas.
*/
function actualizaDiv() {
    $('#nombresIslas').empty();
    $('#trajesDisponibles').empty();
    $('#contenidoJuego').empty();
    let arrayIslasAgregadas = new Array();
    let max = arrayNIslas[1];
    let min = arrayNIslas[0];
    nIslas = nAleatorio(max, min);

    // Agregado aleatorio de islas
    let i = 0;
    while (i < nIslas) {
        let islaAgregarNombre = arrayNombreIslas[nAleatorio(arrayNombreIslas.length - 1, 0)];
        if (!arrayIslasAgregadas.includes(islaAgregarNombre)) {

            arrayIslasAgregadas.push(islaAgregarNombre);
            $('#contenidoJuego').append(`<img src="img/${islaAgregarNombre}Isla.png" class="isla" name="${islaAgregarNombre}"></img>`);
            //$('#nombresIslas').append(`<label>${islaAgregarNombre}</label>`);
            i++;
        }
    }

    let arrayTrajesAgregados = new Array();
    i = 0;

    // Agregado aleatorio de trajes segun las islas obtenidas
    while (i < dificultadActual) {
        let indice = nAleatorio(listaTrajes.length - 1, 0);
        let trajeAgregar = (`${listaTrajes[indice].nombreIsla}-${listaTrajes[indice].sexo}`)
        if (!arrayTrajesAgregados.includes(trajeAgregar)) {
            if (arrayIslasAgregadas.includes(trajeAgregar.split('-')[0])) {
                arrayTrajesAgregados.push(trajeAgregar);
                $('#trajesDisponibles').append(`<img class="imagen" name="${trajeAgregar.split('-')[0]}" src="img/${trajeAgregar}.png">`);
                i++;
            }
        }
    }

    // Control de si el contenedor donde soltamos el elemento es el adecuado o no
    $('#trajesDisponibles').children().each(function(){
        var top = $(this).position().top;
        var left = $(this).position().left;
    }).draggable({
        containment: "#padreJuego",
        opacity: .4,
        cursor: 'move',
        revert: function (destino) {
            if ($(this).attr('name') === $(destino).attr('name')) {
                $(this).addClass('correcto').removeClass('incorrecto');
                actualizaPuntuación('+');
                return false;
            } else {
                $(this).addClass('incorrecto');
                actualizaPuntuación('-');
                return true;
            }
        }
    });
    $('#contenidoJuego').children().droppable();
}

// Me he hecho una función para obtener números aleatorios porque JavaScript es poco intuitivo
function nAleatorio(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// El nombre de la función es bastante descriptivo.
function actualizaPuntuación(sumarRestar) {
    if (sumarRestar === '+') {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        if (puntuacionActual < parseInt(dificultadActual) - 1) {
            toastr.success('¡Correcto!');
        } else {
            console.log('SE ACABA')
            acabaJuego('gana')
        }
        puntuacionActual++;
        $('#puntuacion').text(puntuacionActual);
    } else {
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        if (nErrores < parseInt(arrayErrores[indiceError]) - 1) {
            console.log(`VALOR MAXIMO ${arrayErrores[indiceError]} VALOR ACTUAL ${nErrores}`)

            toastr.error('Has fallado...')
        } else {
            console.log('SE ACABA')
            acabaJuego('pierde');
        }
        nErrores++;
        $('#errores').text(nErrores);
    }
}

function acabaJuego(resultado) {
    if (resultado === 'gana') {
        actualizaDiv();
        $("#resultadoPartida").text('ganado');
    } else {
        $("#resultadoPartida").text('perdido');
    }
    $("#modal").dialog("open");

    $("#siReinicia").click(reiniciaJuego);
    $("#noReinicia").click(terminaJuego)
}

function reiniciaJuego() {
    $("#modal").dialog("close");
    nErrores = 0;
    puntuacionActual = 0;
    $('#puntuacion').text(puntuacionActual);
    $('#errores').text(nErrores);
    actualizaDiv();
}

function terminaJuego(){
    $("#padreJuego").empty();
    $("#divPuntuacion").empty();
    $("#divBotones").parent().empty();
    $("#modal").dialog("close");
    $("#padreJuego").append('<h3>Hasta la próxima!</h3>');
}