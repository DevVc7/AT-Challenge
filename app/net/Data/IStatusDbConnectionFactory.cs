using System.Data.SqlClient;

namespace net.Data
{
    public interface IStatusDbConnectionFactory
    {
        SqlConnection CreateConnection();
    }
}

