﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PoderJudicial.SIPOH.Entidades.Enum
{
    public enum Estatus
    {
        SIN_RESULTADO = 0,
        OK = 1,
        ERROR = 2,
        DUPLICADO = 3,
        NO_DUPLICADO = 4,
        ACTIVO = 5,
        INACTIVO = 6
    }
    public enum TipoJuzgado
    {
        TRADICIONAL = 0,
        ACUSATORIO = 1
    }
    public enum TipoExpediente 
    {
       CAUSA = 0,
       NUC = 1
    }

    public enum Relacionadas 
    {
       CAUSAS = 0,
       TOCAS = 1,
       AMPAROS = 2,
       ANEXOS = 3,
       EJECUCION = 4
    }
}
