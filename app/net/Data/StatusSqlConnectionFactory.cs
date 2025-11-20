using System;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace net.Data
{
    public class StatusSqlConnectionFactory : IStatusDbConnectionFactory
    {
        private readonly string _connectionString;

        public StatusSqlConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("StatusSqlServer")
                ?? throw new InvalidOperationException("Status SQL Server connection string is missing.");
        }

        public SqlConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}

