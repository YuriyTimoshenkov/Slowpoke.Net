using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public interface ICryptoProvider
    {
        string SignKey { get; }
        string ComputeHash(string basicQueryString, string hashKey);
    }
}
