using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using net.Data;
using net.Models;

namespace net.Repositories
{
    public class AgentRepository : IAgentRepository
    {
        private const string AgentSelectColumns = @"
            Id,
            FirstName,
            LastName,
            Phone,
            Username,
            PasswordHash,
            Status,
            ReferralParentId,
            CreatedAt,
            UpdatedAt";

        private readonly IDbConnectionFactory _connectionFactory;

        public AgentRepository(IDbConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Agent> GetByUsernameAsync(string username)
        {
            const string sql = @"SELECT TOP 1 " + AgentSelectColumns + @"
                                FROM dbo.Agents
                                WHERE Username = @username";

            using (var connection = _connectionFactory.CreateConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<Agent>(sql, new { username });
            }
        }

        public async Task<Agent> GetByIdAsync(Guid id)
        {
            const string sql = @"SELECT " + AgentSelectColumns + @"
                                FROM dbo.Agents
                                WHERE Id = @id";

            using (var connection = _connectionFactory.CreateConnection())
            {
                return await connection.QuerySingleOrDefaultAsync<Agent>(sql, new { id });
            }
        }

        public async Task SetStatusAsync(Guid id, string status)
        {
            const string sql = @"UPDATE dbo.Agents
                                SET Status = @status,
                                    UpdatedAt = SYSUTCDATETIME()
                                WHERE Id = @id";

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.ExecuteAsync(sql, new { id, status });
            }
        }

        public async Task<IEnumerable<Agent>> GetAllAsync()
        {
            const string sql = @"SELECT " + AgentSelectColumns + @" FROM dbo.Agents";

            using (var connection = _connectionFactory.CreateConnection())
            {
                return await connection.QueryAsync<Agent>(sql);
            }
        }

        public async Task<Guid> CreateAsync(Agent agent)
        {
            const string sql = @"
                INSERT INTO dbo.Agents
                (Id, FirstName, LastName, Phone, Username, PasswordHash, Status, ReferralParentId)
                VALUES (@Id, @FirstName, @LastName, @Phone, @Username, @PasswordHash, @Status, @ReferralParentId)";

            var id = agent.Id == Guid.Empty ? Guid.NewGuid() : agent.Id;

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.ExecuteAsync(sql, new
                {
                    Id = id,
                    agent.FirstName,
                    agent.LastName,
                    agent.Phone,
                    agent.Username,
                    agent.PasswordHash,
                    agent.Status,
                    agent.ReferralParentId
                });
            }

            return id;
        }

        public async Task DeleteWithReferralsAsync(Guid id)
        {
            const string sql = @"
                ;WITH ToDelete AS (
                    SELECT Id FROM dbo.Agents WHERE Id = @Id
                    UNION ALL
                    SELECT a.Id FROM dbo.Agents a
                    INNER JOIN ToDelete td ON a.ReferralParentId = td.Id
                )
                DELETE FROM dbo.Agents WHERE Id IN (SELECT Id FROM ToDelete)
            ";

            using (var connection = _connectionFactory.CreateConnection())
            {
                await connection.ExecuteAsync(sql, new { Id = id });
            }
        }
    }
}

