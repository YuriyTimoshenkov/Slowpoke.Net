using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Commons;

namespace SlowpokeEngine.Engines
{
    public class BodyCollection : EntityCollection<Guid, ActiveBody>
    {
        public BodyCollection() : base("Id")
        {
            
        }
    }
}
