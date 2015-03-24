using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.DAL
{
    public class GameCharacter
    {
        public Guid Id { get; set; }
        public Guid OnwerUserId { get; set; }
    }
}
