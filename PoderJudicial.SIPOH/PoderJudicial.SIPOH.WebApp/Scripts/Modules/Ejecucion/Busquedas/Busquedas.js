﻿var EstatusRespuesta = { SIN_RESPUESTA: 0, OK: 1, ERROR: 2 }

var estructuraTablaNumeroEejecucionPartes = [{ data: 'NumeroEjecucion', title: 'N° Ejecución' }, { data: 'NombreJuzgado', title: 'Juzgado de Ejecución' }, { data: 'FechaEjecucion', title: 'Fecha Ejecución' }, { data: 'ParteRelacioanada', title: 'Parte Causas' }, { data: 'TipoParte', title: 'Tipo Parte' }, { data: 'DescripcionSolicitud', title: 'Solicitud' }, { data: 'DetalleSolicitante', title: 'Detalle del Solicitante' }, { data: 'Beneficiario', title: 'Beneficiario' }, { data: 'Tipo', title: 'Tipo Expediente' },{ data: 'Causas', title: 'Detalle', className: "text-center"}];
var estructuraTablaNumeroEjecucion = [{ data: 'NumeroEjecucion', title: 'N° Ejecución' }, { data: 'NombreJuzgado', title: 'Juzgado de Ejecución' }, { data: 'FechaEjecucion', title: 'Fecha Ejecución' }, { data: 'DescripcionSolicitud', title: 'Solicitud' }, { data: 'DetalleSolicitante', title: 'Detalle del Solicitante' }, { data: 'Beneficiario', title: 'Beneficiario' }, { data: 'Tipo', title: 'Tipo Expediente' }, { data: 'Causas', title: 'Detalle', className: "text-center" }];

var numeroEjecucionDatos = [];
var dataTableNumeroEjecucion = null;

var estructuraTablaCausas = [{ data: 'CausaNuc', title: 'Causa|Nuc' }, { data: 'NombreJuzgado', title: 'N° Juzgado' }, { data: 'Ofendidos', title: 'Ofendido(s)' }, { data: 'Inculpados', title: 'Inculpado(s)' }, { data: 'Delitos', title: 'Delito(s)' }];
var causas = [];
var dataTableCausas = null;

var formPartes = false;

$(document).ready(function ()
{
    //Agregar funcionalidad para Next Input
    SiguienteInput();

    //Pinta la tabla en el ejecucion
    dataTableNumeroEjecucion = GeneraTablaDatos(dataTableNumeroEjecucion, "dataTableNumeroEjecucion", numeroEjecucionDatos, estructuraTablaNumeroEjecucion, false, false, false);

    //Funcionalidad de Elementos al Cargado
    ElementosAlCargado();
});

function ElementosAlCargado()
{
    //Deshabilita option para juzgado acusatorio
    $("#slctJuzgadoPorDistritos").prop('disabled', true);

    $("#inpCausa").prop('disabled', true);

    $('#slctDistrito').change(function ()
    {
        var idDistrito = $("#slctDistrito").find('option:selected').val();

        //Metodo que contiene el proceso para llenado de pick List Juzgados Tradicionales
        if (idDistrito != "" && idDistrito != null)
        {
            $("#slctJuzgadoPorDistritos").prop('disabled', false);
            RecuperaJuzgadosAcusatorioTradicional(idDistrito);
        }
        else
        {
            $("#slctJuzgadoPorDistritos").prop('disabled', true);
            $("#slctJuzgadoPorDistritos").html("");
            $("#slctJuzgadoPorDistritos").append($("<option/>", { value: "", text: "SELECCIONAR OPCIÓN" }));
            $("#inpCausa").prop('disabled', true);
            $("#inpCausa").val("");
        }
    });

    $('#slctJuzgadoPorDistritos').change(function ()
    {
        var idJuzgado = $("#slctJuzgadoPorDistritos").find('option:selected').val();

        //Metodo que contiene el proceso para llenado de pick List Juzgados Tradicionales
        if (idJuzgado != "" && idJuzgado != null)
        {
            $("#inpCausa").prop('disabled', false);    
        }
        else
        {
            $("#inpCausa").prop('disabled', true);
            $("#inpCausa").val("");
        }
    });

    $("#inpNuc").prop('disabled', true);

    $('#slctJuzgadoAcusatorio').change(function ()
    {
        var idJuzgado = $("#slctJuzgadoAcusatorio").find('option:selected').val();

        //Metodo que contiene el proceso para llenado de pick List Juzgados Tradicionales
        if (idJuzgado != "" && idJuzgado != null)
        {
            $("#inpNuc").prop('disabled', false);
        }
        else
        {
            $("#inpNuc").prop('disabled', true);
            $("#inpNuc").val("");
        }
    });

    //Funcionalidad para validar formularios
    var forms = document.getElementsByClassName('needs-validation');

    Array.prototype.filter.call(forms, function (form)
    {
        form.addEventListener('submit', function (event)
        {
            var id = form.id;

            event.preventDefault();
            event.stopPropagation();

            if (id == "formPartesCausa" || id == "formBeneficiario")
            {
                //Valida solo campos especificos del formulario
                var validateGroup = form.getElementsByClassName('validate-me');

                for (var i = 0; i < validateGroup.length; i++)
                {
                    validateGroup[i].classList.add('was-validated');
                }
            }
            else
            {
               //Valida todos los campos del formulario
               form.classList.add('was-validated');
            }

            //reset de tabla "if reducido"
            formPartes = formPartes ? false : false;

            if (form.checkValidity() === true && id == "formPartesCausa")
            {
                //campo bandera que valida
                formPartes = true;
                BuscarEjecucionPorPartesBeneficiarios();
            }

            if (form.checkValidity() === true && id == "formBeneficiario")
            {
                formPartes = false;
                BuscarEjecucionPorPartesBeneficiarios();
            }

            if (form.checkValidity() === true && id == "formCausasEjecucion")
            {
                BuscarEjecucionPorNumerodeCausa();
            }

            if (form.checkValidity() === true && id == "formNucEjecucion")
            {
                BuscarEjecucionPorNUC();
            }

            if (form.checkValidity() === true && id == "formSolicitanteEjecucion")
            {
                BuscarPorSolicitante();
            } 

            if (form.checkValidity() === true && id == "formDetalleSolicitanteEjecucion")
            {
                BuscarPorDetalleSolicitante();
            } 

        }, false);
    });
}

function RecuperaJuzgadosAcusatorioTradicional(idDistrito)
{
    if (idDistrito != null)
    {
        var parametros = { idDistrito: idDistrito }
        SolicitudEstandarAjax("/Busquedas/ObtenerJuzgadosPorDistrito", parametros, GenerarOptionSelectJuzgadoPorDistrito);
    }
    else
    {
        alert("Error al obtener los datos");
    }
}

function GenerarOptionSelectJuzgadoPorDistrito(data)
{
    if (data.Estatus == EstatusRespuesta.OK)
    {
        var numero = data.Data.length;

        $("#slctJuzgadoPorDistritos").html("");

        if (numero > 1)
        {
            $("#slctJuzgadoPorDistritos").append($("<option/>", { value: "", text: "SELECCIONAR OPCIÓN" }));
        }

        const ObjJuzgadoTra = [data.Data];
        var $slcTradi = $('#slctJuzgadoPorDistritos');

        $.each(ObjJuzgadoTra, function (id, juzgado)
        {
            for (var i = 0; i < juzgado.length; i++)
            {
                $slcTradi.append('<option value=' + juzgado[i].Value + '>' + juzgado[i].Text + '</option>');
            }
        });
    }
    else if (data.Estatus == EstatusRespuesta.ERROR)
    {
        customNotice(data.Mensaje, "Error:", "error", 3350);
    }
}

function BuscarEjecucionPorPartesBeneficiarios()
{
    var idNombre = formPartes ? "inpNombreParte" : "inpNombreBeneficiario";
    var idApellidoPaterno = formPartes ? "inpApellidoPaternoParte" : "inpApellidoPaternoBeneficiario";
    var idApellidoMaterno = formPartes ? "inpApellidoMaternoPartes" : "inpApellidoMaternoBeneficiario";

    var nombre = $('#' + idNombre).val();
    var apellidoPaterno = $('#' + idApellidoPaterno).val();
    var apellidoMaterno = $('#' + idApellidoMaterno).val();

    var parametros = { nombre: nombre, apellidoPaterno: apellidoPaterno, apellidoMaterno: apellidoMaterno };

    if (formPartes)
    {
        $("#loading").fadeIn();
        SolicitudEstandarAjax("/Busquedas/BusquedaPorPartesCausa", parametros, ListarNumerosDeEjecucion);
    }
    else
    {
        $("#loading").fadeIn();
        SolicitudEstandarAjax("/Busquedas/BusquedaPorBeneficiario", parametros, ListarNumerosDeEjecucion);
    } 
}

function BuscarEjecucionPorNumerodeCausa()
{
    //asigno el valor al nombre exacto en mi html de mi elemento 'select' 'input'
    var juzgado = $('#slctJuzgadoPorDistritos').val();
    var numCausa = $('#inpCausa').val();

    //los parametros deben llamarse igual que en mi metodo de controlador
    var parametros = { idJuzgado: juzgado, numCausa: numCausa };

    $("#loading").fadeIn();
    SolicitudEstandarAjax("/Busquedas/BusquedaPorNumeroCausa", parametros, ListarNumerosDeEjecucion);
}

function BuscarEjecucionPorNUC()
{
    var juzgado = $('#slctJuzgadoAcusatorio').val();
    var nuc = $('#inpNuc').val();
    
    var parametros = { NUC: nuc, idJuzgado: juzgado };

    $("#loading").fadeIn();
    SolicitudEstandarAjax("/Busquedas/BusquedaPorNUC", parametros, ListarNumerosDeEjecucion);
}

function BuscarPorSolicitante()
{
    var solicitante = $('#slctSolicitante').val();
    var parametros = { idSolicitante: solicitante };

    $("#loading").fadeIn();
    SolicitudEstandarAjax("/Busquedas/BusquedaPorSolicitante", parametros, ListarNumerosDeEjecucion);
}

function BuscarPorDetalleSolicitante()
{
    var detalleSolicitante = $('#inpDetalleSolicitante').val();
    var parametros = { detalleSolicitante: detalleSolicitante };

    $("#loading").fadeIn();

    //Se ejecuta solictud por url (nombre modulo, nombre de metodo en controlador), parametros y funcion callbacksuccess
    SolicitudEstandarAjax("/Busquedas/BusquedaPorDetalleSolicitante", parametros, ListarNumerosDeEjecucion);
}

//Fucion general para busquedas  nota: de PartesCausa y Beneficiario
function ListarNumerosDeEjecucion(respuesta)
{
    if (respuesta.Estatus == EstatusRespuesta.OK)
    {
        $("#loading").fadeOut();

        //Limpia elementos de la lista
        numeroEjecucionDatos = [];

        numeroEjecucionDatos = formPartes ? respuesta.Data.busquedaNumerosEjecucionPartes : respuesta.Data.busquedaNumerosEjecucion;

        for (var index = 0; index < numeroEjecucionDatos.length; index++)
        {
            numeroEjecucionDatos[index].Causas = "<button type='button' onclick='BuscarCausas(" + index + ")' class='btn btn-link btn-primary' data-toggle='tooltip' title = 'Buscar Causa'><i class='fa fa-search-plus icon'></i></button>";
        }

        var busquedaOrdenar = numeroEjecucionDatos.length > 10 ? true : false;
        var estructura = formPartes ? estructuraTablaNumeroEejecucionPartes : estructuraTablaNumeroEjecucion;

        //renderiza tabla 
        dataTableNumeroEjecucion = GeneraTablaDatos(dataTableNumeroEjecucion, "dataTableNumeroEjecucion", numeroEjecucionDatos, estructura, busquedaOrdenar, busquedaOrdenar, false);
    }
    else if (respuesta.Estatus == EstatusRespuesta.ERROR)
    {
        $("#loading").fadeOut();
    }
    else if (respuesta.Estatus == EstatusRespuesta.SIN_RESPUESTA)
    {
        $("#loading").fadeOut();

        //Limpia elementos de la lista
        numeroEjecucionDatos = [];

        //Muestra al usuario un mensaje si la consulta no genero resultado
        Alerta(respuesta.Mensaje);

        if (formPartes)
        {
            dataTableNumeroEjecucion = GeneraTablaDatos(dataTableNumeroEjecucion, "dataTableNumeroEjecucion", numeroEjecucionDatos, estructuraTablaNumeroEejecucionPartes, false, false, false);
        }
        else
        {
            dataTableNumeroEjecucion = GeneraTablaDatos(dataTableNumeroEjecucion, "dataTableNumeroEjecucion", numeroEjecucionDatos, estructuraTablaNumeroEjecucion, false, false, false);
        }
    }
}

function BuscarCausas(index)
{
    var idEjecucion = numeroEjecucionDatos[index].IdEjecucion;
    var numeroEjecucion = numeroEjecucionDatos[index].NumeroEjecucion;
    var juzgadoEjecucion = numeroEjecucionDatos[index].NombreJuzgado;

    var parametros = { idEjecucion: idEjecucion };
    $("#detalleModal").html('Causas relacionadas a la Ejecución con Número <b>' + numeroEjecucion + ' - ' + juzgadoEjecucion +'</b>');

    $("#loading").fadeIn();
    SolicitudEstandarAjax("/Busquedas/ObtenerCausasRelacionadasEjecucion", parametros, ListarCausasPorEjecucion);
}

function ListarCausasPorEjecucion(respuesta)
{
    if (respuesta.Estatus == EstatusRespuesta.OK)
    {
        $("#loading").fadeOut();

        //Limpiar lista 
        causas = [];
        causas = respuesta.Data.CausasEjecucion;

        var busquedaOrdenar = causas.length > 10 ? true : false;

        //Pinta la tabla en el ejecucion
        dataTableCausas = GeneraTablaDatos(dataTableCausas, "dataTableCausas", causas, estructuraTablaCausas, busquedaOrdenar, busquedaOrdenar, false, 5);
          
        $("#busquedaCausasModal").modal("show");
    }
    else if (respuesta.Estatus == EstatusRespuesta.SIN_RESPUESTA)
    {

    }
    else if (respuesta.Estatus == EstatusRespuesta.ERROR)
    {

    }
}

function SiguienteInput()
{
    document.addEventListener('keypress', function (evt) {

        // Si el evento NO es una tecla Enter
        if (evt.key !== 'Enter')
        {
            return;
        }

        let element = evt.target;

        // Si el evento NO fue lanzado por un elemento con class "focusNext"
        if (!element.classList.contains('focusNext'))
        {
            return;
        }

        // AQUI logica para encontrar el siguiente
        let tabIndex = element.tabIndex + 1;
        var next = document.querySelector('[tabindex="' + tabIndex + '"]');

        // Si encontramos un elemento
        if (next && !element.classList.contains('focusNextEnd'))
        {
            next.focus();
            event.preventDefault();
        }
    });
}

function GeneraTablaDatos(tabla, idTablaHtml, datos, estructuraTabla, ordering, searching, lengthChange, pageLength = 10)
{
    if (tabla != null)
    {
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
        "pageLength": pageLength,
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
            "sSearch": "Buscar en tabla : ",
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
        drawCallback: function (settings)
        {
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
}

function SolicitudEstandarAjax(url, parametros, functionCallbackSuccess, functionCallbackError = null)
{
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        traditional: true,
        contentType: "application/json; charset=utf-8",
        data: parametros,
        beforeSend: function ()
        {
            // $("#loading").fadeIn(); //Animacion Load
        },
        success: function (data)
        {
            functionCallbackSuccess(data);
        },
        error: function (jqXHR)
        {
            $("#loading").fadeOut();

            var mensaje = '';

            if (jqXHR.status === 0)
            {
                mensaje = 'No esta conectado, verifique su conexión.';
            }
            else if (jqXHR.status == 404)
            {
                mensaje = 'No se encontró la página solicitada, ERROR:404';
            }
            else if (jqXHR.status == 500)
            {
                mensaje = "Error interno del servidor, ERROR:500";
            }
            else if (exception === 'timeout')
            {
                mensaje = 'Error de Time Out.';
            }
            else if (exception === 'abort')
            {
                mensaje = 'Solicitud AJAX Abortada.';
            }
            else
            {
                mensaje = 'Error no detectado : ' + jqXHR.responseText;
            }

            if (functionCallbackError == null)
            {
                Alerta(mensaje, "large", "Error ");
            }

            if (functionCallbackError != null)
            {
                var data = mensaje;
                functionCallbackError(data);
            }
        }
    });
}

function Alerta(mensaje, tamanio = null, titulo = null)
{
    titulo = titulo == null ? "¡Atención!" : titulo;
    tamanio = tamanio == null ? "small" : tamanio;

    bootbox.alert({
        title: "<h3>" + titulo + "</h3>",
        message: mensaje,
        buttons:
        {
            ok:
            {
                label: '<i class="fa fa-check"></i> Aceptar',
                className: 'btn btn-outline-success'
            }
        },
        size: tamanio
    });
}
