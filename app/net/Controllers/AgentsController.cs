using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using net.Models;
using net.Models.Auth;
using net.Models.Referrals;
using net.Repositories;
using net.Services;

namespace net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AgentsController : ControllerBase
    {
        private readonly IAgentRepository _agentRepository;

        public AgentsController(IAgentRepository agentRepository)
        {
            _agentRepository = agentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAgents()
        {
            var agents = await _agentRepository.GetAllAsync();
            return Ok(agents.Select(AgentDto.FromAgent));
        }

        [HttpPost]
        public async Task<ActionResult<AgentDto>> CreateAgent([FromBody] CreateAgentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _agentRepository.GetByUsernameAsync(request.Username);
            if (existingUser != null)
            {
                return Conflict(new { message = "Username already exists" });
            }

            var agent = new Agent
            {
                Id = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Phone = request.Phone,
                Username = request.Username,
                PasswordHash = PasswordHasher.Hash(request.Password),
                Status = AgentStatus.Inactive,
                ReferralParentId = request.ReferralParentId
            };

            await _agentRepository.CreateAsync(agent);

            return CreatedAtAction(nameof(GetAgents), new { id = agent.Id }, AgentDto.FromAgent(agent));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAgent(Guid id)
        {
            try
            {
                // Check if agent exists before attempting to delete
                var agent = await _agentRepository.GetByIdAsync(id);
                if (agent == null)
                {
                    return NotFound(new { message = "Agent not found" });
                }

                await _agentRepository.DeleteWithReferralsAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}

