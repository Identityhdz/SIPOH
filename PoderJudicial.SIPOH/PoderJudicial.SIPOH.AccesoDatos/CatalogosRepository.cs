﻿using PoderJudicial.SIPOH.AccesoDatos.Conexion;
using PoderJudicial.SIPOH.AccesoDatos.Helpers;
using PoderJudicial.SIPOH.AccesoDatos.Interfaces;
using PoderJudicial.SIPOH.Entidades;
using PoderJudicial.SIPOH.Entidades.Enum;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace PoderJudicial.SIPOH.AccesoDatos
{
    public class CatalogosRepository : ICatalogosRepository
    {
        //Atributos Publicos del Repositorio
        public string MensajeError { set; get; }
        public Estatus Estatus { get; set; }

        //Atributos privados del Repositorio
        private SqlConnection Cnx;
        private bool IsValidConnection = false;

        /// <summary>
        /// Metodo contructor del repositorio Catalgos
        /// </summary>
        /// <param name="connection">Conexion al servidor SQL</param>
        public CatalogosRepository(ServerConnection connection) 
        {
            Cnx = connection.SqlConnection;
            IsValidConnection = connection.IsValidConnection;
        }

        /// <summary>
        /// Retorna lista de distritos por medio del cicuito
        /// </summary>
        /// <param name="idCircuito">Id del circuito al que pertenece los distritos</param>
        /// <returns></returns>
        public List<Distrito> ConsultaDistritos(int idCircuito)
        {
            try
            {
                if (!IsValidConnection)
                throw new Exception("No se ha creado una conexion valida");

                SqlCommand comando = new SqlCommand("sipoh_ConsultarDistritosPorCircuito", Cnx);
                comando.CommandType = CommandType.StoredProcedure;
                comando.Parameters.Add("@idCircuito", SqlDbType.Int).Value = idCircuito;
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Distrito> distritos = DataHelper.DataTableToList<Distrito>(tabla);
                
                if (distritos.Count > 0)
                Estatus = Estatus.OK;
                else
                Estatus = Estatus.SIN_RESULTADO;

                return distritos;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        /// <summary>
        /// Retorna lista de Juzgados filtrados por tipo y distrito o circuito
        /// </summary>
        /// <param name="idCircuitoDistrito">Representa el Id del Circuito o Distrito al que pertenece el Juzgado</param>
        /// <param name="sistema">Representa el tipo de Juzgado de retorno</param>
        /// <returns></returns>
        public List<Juzgado> ConsultaJuzgados(TipoSistema sistema, int idCircuitoDistrito)
        {
            try
            {
                if (!IsValidConnection)
                throw new Exception("No se ha creado una conexion valida");

                string storeProcedure = sistema == TipoSistema.ACUSATORIO ? "sipoh_ConsultarJuzgadosPorCircuitoAcusatorio" : "sipoh_ConsultarJuzgadosPorDistritoTradicional";

                SqlCommand comando = new SqlCommand(storeProcedure, Cnx);
                comando.CommandType = CommandType.StoredProcedure;

                if(sistema == TipoSistema.ACUSATORIO)
                comando.Parameters.Add("@idCircuito", SqlDbType.Int).Value = idCircuitoDistrito;

                if (sistema == TipoSistema.TRADICIONAL)
                comando.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idCircuitoDistrito;

                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Juzgado> juzgados = DataHelper.DataTableToList<Juzgado>(tabla);

                if (juzgados.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return juzgados;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        /// <summary>
        /// Metodo que retorna los salas(Juzgados) por tipo tradicional o acusatorio
        /// </summary>
        /// <param name="tipoJuzgado">Filtro para obtener salas de tipo tradicional o acusatorios</param>
        /// <returns></returns>
        public List<Juzgado> ConsultaJuzgados(TipoSistema tipoJuzgado)
        {
            try
            {
                if (!IsValidConnection)
                throw new Exception("No se ha creado una conexion valida");

                string tipoSistema = tipoJuzgado == TipoSistema.ACUSATORIO ? "SA" : "ST";

                SqlCommand comando = new SqlCommand("sipoh_ConsultarSalasPorTipoSistema", Cnx);
                comando.CommandType = CommandType.StoredProcedure;
                comando.Parameters.Add("@tipoSistema", SqlDbType.VarChar).Value = tipoSistema;

                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Juzgado> juzgados = DataHelper.DataTableToList<Juzgado>(tabla);

                if (juzgados.Count > 0)
                   Estatus = Estatus.OK;
                else
                   Estatus = Estatus.SIN_RESULTADO;

                return juzgados;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                Cnx.Close();
            }
        }

        public List<Juzgado> ConsultaJuzgados(int idCircuitoDistrito, TipoJuzgado? tipoJuzgado = null)
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                string storedProcedure = tipoJuzgado == TipoJuzgado.EJECUCION ? "sipoh_ConsultarJuzgadosEjecucionPorCircuito" : "sipoh_ConsultarJuzgadosPorDistritos";

                SqlCommand comando = new SqlCommand(storedProcedure, Cnx);
                comando.CommandType = CommandType.StoredProcedure;

                if(tipoJuzgado == null)
                comando.Parameters.Add("@idDistrito", SqlDbType.Int).Value = idCircuitoDistrito;

                if(tipoJuzgado == TipoJuzgado.EJECUCION)
                comando.Parameters.Add("@idcircuito", SqlDbType.Int).Value = idCircuitoDistrito;

                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Juzgado> jusgados = DataHelper.DataTableToList<Juzgado>(tabla);

                if (jusgados.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return jusgados;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Anexo> ConsultaAnexos(string tipo)
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                SqlCommand comando = new SqlCommand("sipoh_ConsultarAnexosPorTipo", Cnx);
                comando.CommandType = CommandType.StoredProcedure;
                comando.Parameters.Add("@tipo", SqlDbType.VarChar).Value = tipo;
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Anexo> distritos = DataHelper.DataTableToList<Anexo>(tabla);

                if (distritos.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return distritos;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Anexo> ConsultaAnexos(int idEjecucion, Instancia instancia) 
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexión valida.");

                string storedProcedure = instancia == Instancia.INICIAL ? "sipoh_ConsultarAnexosPorEjecucion" : "sipoh_ConsultarAnexosPorEjecucionPosterior";

                SqlCommand comando = new SqlCommand(storedProcedure, Cnx);
                comando.CommandType = CommandType.StoredProcedure;

                if(instancia == Instancia.INICIAL)
                comando.Parameters.Add("@idEjecucion", SqlDbType.Int).Value = idEjecucion;

                if(instancia == Instancia.PROMOCION)
                comando.Parameters.Add("@idEjecucionPosterior", SqlDbType.Int).Value = idEjecucion;

                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Anexo> anexos = DataHelper.DataTableToList<Anexo>(tabla);

                if (anexos.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return anexos;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Solicitud> ConsultaSolicitudes()
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                string query = "SELECT * FROM P_Solicitud";

                SqlCommand comando = new SqlCommand(query, Cnx);
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Solicitud> solicitud = DataHelper.DataTableToList<Solicitud>(tabla);

                if (solicitud.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return solicitud;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Solicitante> ConsultaSolicitantes()
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                string query = "SELECT * FROM P_Solicitante";

                SqlCommand comando = new SqlCommand(query, Cnx);
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Solicitante> solicitante = DataHelper.DataTableToList<Solicitante>(tabla);

                if (solicitante.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return solicitante;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Toca> ConsultaTocas(int idEjecucion)
        {
            try
            {
                if (!IsValidConnection) 
                    throw new Exception("No se ha creado una conexión valida.");

                SqlCommand comando = new SqlCommand("sipoh_ConsultarEjecucionOriTocaPorPorFolio", Cnx);
                comando.CommandType = CommandType.StoredProcedure;
                comando.Parameters.Add("@folio", SqlDbType.Int).Value = idEjecucion;
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Toca> tocas = DataHelper.DataTableToList<Toca>(tabla);

                if (tocas.Count > 0)
                    Estatus = Estatus.OK;
                else 
                    Estatus = Estatus.SIN_RESULTADO;

                return tocas;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<string> ConsultaAmparos(int idEjecucion)
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                string query = "SELECT Amparo FROM P_EjecucionOriAmpa WHERE IdEjecucion = @folio";

                SqlCommand comando = new SqlCommand(query, Cnx);
                comando.Parameters.Add("@folio", SqlDbType.Int).Value = idEjecucion;
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<string> amparos = CreaListaDeTipoString(tabla);

                if (amparos.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return amparos;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        public List<Delito> ConsultaDelitos()
        {
            try
            {
                if (!IsValidConnection)
                    throw new Exception("No se ha creado una conexion valida");

                string query = "SELECT IdSubSerie AS IdDelito, Nombre FROM S_SubSerie WHERE Mostrar = 'S'";

                SqlCommand comando = new SqlCommand(query, Cnx);
                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Delito> delitos = DataHelper.DataTableToList<Delito>(tabla);

                if (delitos.Count > 0)
                    Estatus = Estatus.OK;
                else
                    Estatus = Estatus.SIN_RESULTADO;

                return delitos;
            }
            catch (Exception ex)
            {
                MensajeError = ex.Message;
                Estatus = Estatus.ERROR;
                return null;
            }
            finally
            {
                if (IsValidConnection && Cnx.State == ConnectionState.Open)
                    Cnx.Close();
            }
        }

        #region Metodos Privados de la Clase
        private List<string> CreaListaDeTipoString(DataTable dataTableAmparos)
        {
            List<string> amparos = new List<string>();

            for (int i = 0; i < dataTableAmparos.Rows.Count; i++)
            {
                string amparo = dataTableAmparos.Rows[i]["Amparo"].ToString();
                amparos.Add(amparo);
            }

            return amparos;
        }
        #endregion
    }
}
