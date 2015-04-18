using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Bodies
{
    public interface IUsableBody
    {
        Guid Id { get; }
        void Use(ActiveBody consumerBody);
    }
}
