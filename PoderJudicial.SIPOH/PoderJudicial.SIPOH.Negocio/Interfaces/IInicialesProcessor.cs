﻿using PoderJudicial.SIPOH.Entidades;
using PoderJudicial.SIPOH.Entidades.Enum;

using System.Collections.Generic;

namespace PoderJudicial.SIPOH.Negocio.Interfaces
{
    public interface IInicialesProcessor
    {
        string Mensaje { get; set; }
        List<Juzgado> RecuperaJuzgado(int idFiltro, TipoSistema tipoJuzgado);
        List<Juzgado> RecuperaSala(TipoSistema tipoJuzgado);
        List<Distrito> RecuperaDistrito(int idCircuito);
        Expediente RecuperaExpedientes(int idJuzgado, string numeroExpediente, TipoNumeroExpediente expediente);
        List<Ejecucion> RecuperaSentenciadoBeneficiario(string nombre, string apellidoPaterno, string apellidoMaterno, int idCircuito);
        List<Anexo> RecuperaAnexos(string tipo);
        List<Solicitante> RecuperaSolicitante();
        List<Solicitud> RecuperaSolicitud();
        int? CrearRegistroInicialDeEjecucion(Ejecucion ejecucion, List<Toca> tocas, List<Anexo> anexos, List<string> amparos, List<int> causas, int circuito);
        bool ObtenerInformacionGeneralInicialDeEjecucion(int folio, ref Ejecucion ejecucion, ref List<Expediente> causas, ref List<Toca> tocas, ref List<string> amparos, ref List<Anexo> anexos, ref List<Relacionadas> relacionadas);
    }
}
