using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using net.Models;

namespace net.Services
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly JwtOptions _options;
        private readonly SymmetricSecurityKey _signingKey;

        public JwtTokenGenerator(IOptions<JwtOptions> optionsAccessor)
        {
            _options = optionsAccessor.Value ?? throw new ArgumentNullException(nameof(optionsAccessor));
            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        }

        public string GenerateToken(Agent agent)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, agent.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, agent.Username),
                new Claim(ClaimTypes.NameIdentifier, agent.Id.ToString()),
                new Claim("fullName", agent.FullName),
                new Claim("status", agent.Status ?? string.Empty)
            };

            var credentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

