using System.Security.Cryptography;
using System.Text;

namespace net.Services
{
    public static class PasswordHasher
    {
        public static string Hash(string input)
        {
            using (var sha = SHA256.Create())
            {
                var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
                var builder = new StringBuilder(bytes.Length * 2);
                foreach (var b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public static bool Verify(string input, string hashedValue)
        {
            if (string.IsNullOrEmpty(hashedValue))
            {
                return false;
            }

            var computed = Hash(input);
            return string.Equals(computed, hashedValue, System.StringComparison.OrdinalIgnoreCase);
        }
    }
}

