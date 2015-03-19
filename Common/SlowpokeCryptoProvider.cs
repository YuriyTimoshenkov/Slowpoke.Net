using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class SlowpokeCryptoProvider : ICryptoProvider
    {
        private readonly string _signKey = "Sign";
        public string SignKey
        {
            get { return _signKey; }
        }

        public string ComputeHash(string basicQueryString, string hashKey)
        {
            byte[] textBytes = Encoding.UTF8.GetBytes(basicQueryString);
            byte[] hashKeyBytes = Encoding.UTF8.GetBytes(hashKey);
            HMACSHA1 hashAlgorithm = new HMACSHA1(hashKeyBytes);
            byte[] signedBytes = hashAlgorithm.ComputeHash(textBytes);

            StringBuilder sb = new StringBuilder();
            foreach (byte x in signedBytes)
            {
                sb.Append(String.Format("{0:x2}", x));
            }

            return sb.ToString();
        }
    }
}
