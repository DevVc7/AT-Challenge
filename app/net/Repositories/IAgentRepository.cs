using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using net.Models;

namespace net.Repositories
{
    public interface IAgentRepository
    {
        Task<Agent> GetByUsernameAsync(string username);
        Task<Agent> GetByIdAsync(Guid id);
        Task SetStatusAsync(Guid id, string status);
        Task<IEnumerable<Agent>> GetAllAsync();
        Task<Guid> CreateAsync(Agent agent);
        Task DeleteWithReferralsAsync(Guid id);
    }
}

