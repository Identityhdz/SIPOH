﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PoderJudicial.SIPOH.Entidades
{
    public class PostEjecucion
    {
        public int IdEjecucion { get; set; }
        public string Promovente { get; set; }
        public int IdUser { get; set; }
        public int IdEjecucionPosterior { get; set; }
    }
}
