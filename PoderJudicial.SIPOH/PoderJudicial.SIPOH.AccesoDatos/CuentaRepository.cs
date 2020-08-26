﻿using PoderJudicial.SIPOH.AccesoDatos.Conexion;
using PoderJudicial.SIPOH.AccesoDatos.Helpers;
using PoderJudicial.SIPOH.AccesoDatos.Interfaces;
using PoderJudicial.SIPOH.Entidades;
using PoderJudicial.SIPOH.Entidades.Enum;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;

namespace PoderJudicial.SIPOH.AccesoDatos
{
    public class CuentaRepository : ICuentaRepository
    {
        //Atributos Publicos del Repositorio
        public string MensajeError { set; get; }
        public Estatus Estatus { set; get; }

        //Atributos privados del Repositorio
        private SqlConnection Cnx;
        private bool IsValidConnection = false;

        //Metodo constructor del repositorio, se le inyecta la clase ServerConnection
        public CuentaRepository(ServerConnection connection)
        {
            Cnx = connection.SqlConnection;
            IsValidConnection = connection.IsValidConnection;
        }

        #region Metodos Publicos del Repositorio
        public Usuario LogIn(string email, string password)
        {
            try
            {
                if (!IsValidConnection)
                throw new Exception("No se ha creado una conexion valida");

                SqlCommand comando = new SqlCommand("sipoh_LogIn", Cnx);
                comando.CommandType = CommandType.StoredProcedure;
                comando.Parameters.Add("@usuario", SqlDbType.VarChar).Value = email;
                comando.Parameters.Add("@contrasenia", SqlDbType.VarChar).Value = password;

                Cnx.Open();

                SqlDataReader sqlRespuesta = comando.ExecuteReader();

                DataTable tabla = new DataTable();
                tabla.Load(sqlRespuesta);

                List<Usuario> usuarios = DataHelper.DataTableToList<Usuario>(tabla);
                if (usuarios.Count > 0)
                {
                    Usuario usuario = usuarios.FirstOrDefault();                    
                    usuario.Activo = true;

                    //Valida que el usuario se encuentre activo
                    if (usuario.Activo)
                    {
                        Estatus = Estatus.OK;
                        return usuario;
                    }
                    Estatus = Estatus.INACTIVO;
                }

                return null;
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
        #endregion

        #region Metodos Privados de la Clase
        #endregion
    }
}
