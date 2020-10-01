﻿/* ELEMENTOS AL CARGADO */

// #region DOCUMENT READY

$(document).ready(function () {
    FormatoInputs();
    OcultarFormulario();
    TablaCausas = Consumir_DataTable(TablaCausas, "_TablaCausasEjecucion", Arreglo_TablaCausas, EstructuraTabla_Causas, false, false, false);
    FuncionalidadesListas();
});

// #endregion 

/* FUNCIONALIDADES */

// #region FUNCIONALIDADES AL CARGADO
function FuncionalidadesListas () {

    // Button Disabled
    $("#btnNuevaConsultaPromocion").prop("disabled", true);

    // Click Button
    $("#btnNuevaConsultaPromocion").click(function (e) {
        e.preventDefault();
        Resultados_NEW();
        });
}
// #endregion

// #region FUNCIONALIDAD: Ocultar Formulario
function OcultarFormulario() {
    $("#divResultadoPromocion").hide();
}
// #endregion

// #region FUNCIONALIDAD: Mostrar Formulario
function MostrarFormulario() {
    $("#divResultadoPromocion").show();
    $(".disabled").prop('disabled', true);
}
// #endregion

// #region FUNCIONALIDAD: Encontró Resultados
function Resultados_OK() {
    $(".resultOK").prop('disabled', true);
    $("#btnNuevaConsultaPromocion").prop("disabled", false);
}
// #endregion

// #region FUNCIONALIDAD: Nueva Consulta
function Resultados_NEW() {
    OcultarFormulario();
    $(".resultOK").prop('disabled', false);
    $(".clean").val("");
    var form = $('#' + "FrmCausaEjecucion")[0];
    $('#slctJuzgadoPorCircuito').prop('selectedIndex', 0);
    var form = $('#FrmCausaEjecucion')[0];
    $(form).removeClass('was-validated');
    $("#_TablaCausasEjecucion").dataTable().fnClearTable();
    $("#btnNuevaConsultaPromocion").prop("disabled", true);
}
// #endregion

// #region FUNCIONALIDAD: Cargar InputMask

function FormatoInputs() {
    FormatearInput("#inpNumeroEjecucion", "9999/9999", "0000/0000", "[0-9]");
}

// #endregion

// #region FUNCIONALIDAD: LISTAR DATOS GENERALES

function ListarDatosGenerales() {
    var slctJuzgado = $("#slctJuzgadoPorCircuito").val();
    var inpNoEjecucion = $("#inpNumeroEjecucion").val();
    var objParametros = { Juzgado: slctJuzgado, NoEjecucion: inpNoEjecucion };
    SolicitudEstandarGetAjax("/Promociones/ObtenerEjecucionPorJuzgado", objParametros, ConsumirMetodo_CrearPromocion);
    console.log(slctJuzgado + " " + inpNoEjecucion);
}

function ConsumirMetodo_CrearPromocion(data) {
    if (data.Estatus == EstatusRespuesta.OK) {
        var Array = data.Data.ListaInformacion;
            var MensajeConfirmacion = "La consulta encontró coincidencias con respecto al numero de ejecucion " + "<b>" + Array[0].NumeroEjecucion + "</b>" + " perteneciente al " + "<b>" + Array[0].NombreJuzgado + "</b>";
        var Funcion_MensajeOK = function () {
                Resultados_OK();
                MostrarFormulario();
                $("#NumeroEjecucion").val(Array[0].NumeroEjecucion);
                $("#NombreJuzgado").val(Array[0].NombreJuzgado);
                $("#DecSolicitante").val(Array[0].DescripcionSolicitante);
                $("#NombreBeneficiario").val(Array[0].NombreBeneficiario + " " + Array[0].ApellidoPBeneficiario + " " + Array[0].ApellidoMBeneficiario);
                $("#DecSolicitud").val(Array[0].DescripcionSolicitud);
                var idEjecucion = (Array[0].IdEjecucion);
                ConsumirMetodo_ObtenerExpedientesPorEjecucion(idEjecucion);
            }
            MensajeNotificacionOK(MensajeConfirmacion, "", Funcion_MensajeOK);   
    } else if (data.Estatus == EstatusRespuesta.ERROR) {
        alert(data.Mensaje);
    } else if (data.Estatus == EstatusRespuesta.SIN_RESPUESTA) {
        var MensajeNoResult = "SISTEMA: " + data.Mensaje + " para el numero de ejecución solicitado.";
        var Funcion_MensajeNoResult = function () {
            // Nothing
        }
        MensajeNotificacionNoResult(MensajeNoResult, "", Funcion_MensajeNoResult);
    }
}

// #endregion

// #region FUNCIONALIDAD: LISTAR CASUAS RELACIONADAS A DATOS GENERALES

function ConsumirMetodo_ObtenerExpedientesPorEjecucion(idEjecucion) {
    var ObjParametros = { idEjecucion: idEjecucion };
    SolicitudEstandarGetAjax("/Promociones/ObtenerExpedientesPorEjecucion", ObjParametros, ListarCausas);
}

function ListarCausas(data) {
    if (data.Estatus = EstatusRespuesta.OK) {
        var ArrayCausas = data.Data.ObtenerEPE;
        var Objct_TablaCausas = new Object();
        Objct_TablaCausas._NombreJuzgado = ArrayCausas[0].NombreJuzgado;
        Objct_TablaCausas._NumeroCausa = ArrayCausas[0].NumeroCausa;
        Objct_TablaCausas._Nuc = ArrayCausas[0].NUC;
        Objct_TablaCausas._Ofendidos = ArrayCausas[0].Ofendidos;
        Objct_TablaCausas._Inculpados = ArrayCausas[0].Inculpados;
        Objct_TablaCausas._Delitos = ArrayCausas[0].Delitos;
        Arreglo_TablaCausas.push(Objct_TablaCausas);
        TablaCausas = Consumir_DataTable(TablaCausas, "_TablaCausasEjecucion", Arreglo_TablaCausas, EstructuraTabla_Causas, false, false, false);
        console.log(JSON.stringify(data));  
    } else if (data.Estatus == EstatusRespuesta.ERROR) {
        alert("Hay un error de comunicación");
    } else if (data.Estatus == EstatusRespuesta.SIN_RESPUESTA) {
        alert("Sin respuesta");
    }
}
// #endregion

// #region FUNCIONALIDAD: AGREAGAR Y GUARDAR ANEXOS
function AgregarAnexos() {
    alert("Agregar Anexos");
}
//#endregion

/*----- FUNCIONES GENERALES -----*/

// #region ESTATUS: Validación de petición AJAX
var EstatusRespuesta = { SIN_RESPUESTA: 0, OK: 1, ERROR: 2 };
// #endregion

// #region ESTRUCTURAS: DataTable

var EstructuraTabla_Causas = [
    { data: '_NombreJuzgado', title: 'JUZGADO', className: "text-center" },
    { data: '_NumeroCausa', title: 'CAUSA', className: "text-center" },
    { data: '_Nuc', title: 'NUC', className: "text-center" },
    { data: '_Ofendidos', title: 'OFENDIDOS (S)', className: "text-center" },
    { data: '_Inculpados', title: 'INCULPADO (S)', className: "text-center" },
    { data: '_Delitos', title: 'DELITO (S)', className: "text-center" }];

var Arreglo_TablaCausas = [];

var EstructuraTabla_Anexos = [
    { data: '_Descripcion', title: "DESCRIPCIÓN", className: "text-center" },
    { data: '_Cantidad', title: "CANTIDAD", className: "text-center" },
    { data: '_Acciones', title: "ACCIONES", className: "text-center" }
];

var Arreglo_TablaAnexos = [];

var TablaCausas = null;
var TablaAnexos = null;

// #endregion

// #region FUNCION: Solicitud Ajax Get
function SolicitudEstandarGetAjax(url, parametros, funcion) {
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        traditional: true,
        contentType: "application/json; charset=utf-8",
        data: parametros,
        beforeSend: function () {
            // $("#loading").fadeIn(); //Animacion Load
        },
        success: function (data) {
            funcion(data);
        },
        error: function (xhr) {
            alert('Error Ajax: ' + xhr.statusText);
            //  $("#loading").fadeOut();
        }
    });
}
// #endregion

// #region FUNCION: Solicitud Ajax Post
// #endregion

// #region FUNCION: Validación de formularios
var forms = document.getElementsByClassName('needs-validation');

Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
        var id = form.id;
        event.preventDefault();
        event.stopPropagation();
        form.classList.add('was-validated');
        if (form.checkValidity() === true && id == "FrmCausaEjecucion") {
            ListarDatosGenerales(true);
        }
        if (form.checkValidity() === true && id == "Frm_Anexos") {
            AgregarAnexos();
        }
    }, false);
});
// #endregion

// #region FUNCIÓN: DataTable
function Consumir_DataTable(tabla, idTablaHtml, datos, estructuraTabla, ordering, searching, lengthChange) {
    if (tabla != null) {
        tabla.destroy();
        $("#" + idTablaHtml).empty();
    }
    return tabla = $("#" + idTablaHtml).DataTable({
        data: datos,
        columns: estructuraTabla,
        rowId: 'id',
        responsive: true,
        "ordering": ordering,
        "searching": searching,
        "lengthChange": lengthChange,
        "pageLength": 5,
        "lengthMenu": [5, 10, 25, 50],
        "language": {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "_START_ al _END_ de _TOTAL_",
            "sInfoEmpty": "0 al 0 de 0",
            "sInfoFiltered": "(Total _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },


        },
        drawCallback: function (settings) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
}

// #endregion

// #region FUNCION: Formato Inputs & Mask
function FormatearInput(IdInput, Formato, placeholder, regExValidator) {
    Inputmask(Formato, {
        _radixDance: false,
        numericInput: false,
        placeholder: placeholder,
        //onKeyValidation: function (key, result) {
        //    if (!result) {
        //        alert('Your input is not valid')
        //    }
        //},
        definitions: {
            "0": {
                validator: regExValidator
            }
        }
    }).mask(IdInput);
}
// #endregion

// #region FUNCIÓN: Notificacion OK
function MensajeNotificacionOK(mensaje, tamanio, funcion) {
    bootbox.confirm({
        title: "<h3>Confirmación</h3>",
        message: mensaje,
        buttons: {
            confirm: {
                label: '<i class="fa fa-check"></i> Aceptar',
                className: 'btn btn-outline-success'
            },
            cancel: {
                label: '<i class="fa fa-times"></i> Cancelar',
                className: 'btn btn-outline-secondary'
            }
        },
        callback: function (result) {
            if (result) {
                funcion();
            }
        },
        size: tamanio
    });
}

// #endregion 

// #region FUNCIÓN: Notificacion NO Result

function MensajeNotificacionNoResult(mensaje) {
    bootbox.alert({
        title: "<h3>¡Atención!</h3>",
        message: mensaje,
        buttons:
        {
            ok: {
                label: '<i class="fa fa-check"></i> Aceptar',
                className: 'btn btn-outline-danger'
            }
        }
    });
}

// #endregion
