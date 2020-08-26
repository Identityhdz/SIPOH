﻿using PoderJudicial.SIPOH.Entidades;
using PoderJudicial.SIPOH.Entidades.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PoderJudicial.SIPOH.AccesoDatos.Interfaces
{
    public interface IExpedienteRepository
    {
        string MensajeError { get; set; }
        Estatus Estatus { get; set; }
        List<Expediente> ObtenerExpedientes(int idJuzgado, string causaNuc, TipoExpediente expediente);
    }
}
