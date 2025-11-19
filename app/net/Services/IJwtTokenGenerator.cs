using net.Models;

namespace net.Services
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(Agent agent);
    }
}

