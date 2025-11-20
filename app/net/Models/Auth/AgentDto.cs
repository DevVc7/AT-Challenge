using net.Models;

namespace net.Models.Auth
{
    public class AgentDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; }
        public string ReferralParentId { get; set; }

        public static AgentDto FromAgent(Agent agent)
        {
            if (agent == null)
            {
                return null;
            }

            return new AgentDto
            {
                Id = agent.Id.ToString(),
                FullName = agent.FullName,
                Username = agent.Username,
                Phone = agent.Phone,
                Status = agent.Status,
                ReferralParentId = agent.ReferralParentId?.ToString()
            };
        }
    }
}

