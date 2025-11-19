using System.Data.SqlClient;

namespace net.Data
{
    public interface IDbConnectionFactory
    {
        SqlConnection CreateConnection();
    }
}

