using Dapper;
using net.Data;
using System;

namespace net.Repositories
{
    public class StatusRepository: IStatusRepository
    {
        private readonly IStatusDbConnectionFactory _connectionFactory;

        public StatusRepository(IStatusDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        string IStatusRepository.getStatus()
        {
            using (var connection = _connectionFactory.CreateConnection())
            {
                try
                {
                    connection.Open();
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
