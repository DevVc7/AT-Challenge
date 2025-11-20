using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using net.Models;
using net.Models.Auth;
using net.Repositories;
using net.Services;

namespace net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAgentRepository _agentRepository;
        private readonly IJwtTokenGenerator _tokenGenerator;

        public AuthController(IAgentRepository agentRepository, IJwtTokenGenerator tokenGenerator)
        {
            _agentRepository = agentRepository;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var agent = await _agentRepository.GetByUsernameAsync(request.Username);
            if (agent == null || !PasswordHasher.Verify(request.Password, agent.PasswordHash))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Invalid username or password" });
            }

            if (!string.Equals(agent.Status, AgentStatus.Active, StringComparison.OrdinalIgnoreCase))
            {
                await _agentRepository.SetStatusAsync(agent.Id, AgentStatus.Active);
                agent.Status = AgentStatus.Active;
            }

            var token = _tokenGenerator.GenerateToken(agent);
            var response = new LoginResponse
            {
                Token = token,
                Agent = AgentDto.FromAgent(agent)
            };

            return Ok(response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<AgentDto>> Me()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(idClaim, out var agentId))
            {
                return StatusCode(StatusCodes.Status401Unauthorized);
            }

            var agent = await _agentRepository.GetByIdAsync(agentId);
            if (agent == null)
            {
                return NotFound();
            }

            return AgentDto.FromAgent(agent);
        }
    }
}

