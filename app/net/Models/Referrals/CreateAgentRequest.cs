using System;
using System.ComponentModel.DataAnnotations;

namespace net.Models.Referrals
{
    public class CreateAgentRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Phone]
        [Required]
        public string Phone { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        public Guid? ReferralParentId { get; set; }
    }
}

