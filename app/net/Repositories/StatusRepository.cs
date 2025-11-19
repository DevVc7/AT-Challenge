using System;
using System.Data.SqlClient;
using Dapper;

namespace net.Repositories
{
    public class StatusRepository: IStatusRepository
    {

        string IStatusRepository.getStatus()
        {
            string connectionString = "Server=sqlserver;Database=master;User Id=sa;Password=ATChal1enge!;";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    return connection.ExecuteScalar<string>("SELECT 'running'");
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
        }

    }
}
