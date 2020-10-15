﻿using PoderJudicial.SIPOH.AccesoDatos;
using PoderJudicial.SIPOH.Entidades;
using PoderJudicial.SIPOH.Entidades.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PoderJudicial.SIPOH.Negocio.Interfaces
{
    public interface IBusquedasProcessor {
        string Mensaje { get; set; }
        List<Ejecucion>ObtenerEjecucionPorPartesCausa(string nombre, string apellidoPaterno, string apellidoMaterno);
        List<Ejecucion> ObtenerEjecucionSentenciadoBeneficiario(string nombre,string apellidoPaterno, string apellidoMaterno);
        List<Ejecucion> ObtenerEjeucionPorNumeroCausa(string numeroCausa, int idJuzgado);
        List<Ejecucion> ObtenerEjecucionPorNUC(string nuc, int idJuzgado);
        List<Ejecucion> ObtenerEjecucionPorDetalleSolicitante(string detalleSolicitante);
        List<Ejecucion> ObtenerEjecucionPorSolicitante(int  idSolicitante);
        List<Distrito> ObtenerDistritoPorCircuito(int idCircuito);
        List<Juzgado> ObtenerJuzgadosAcusatoriosPorCircuito(int idCircuito);
        List<Juzgado> ObtenerJuzgadosPorDistritos(int idDistrito);
        List<Solicitante> ObtenerSolicitanteEjecucion();

    }
    
        
    
}