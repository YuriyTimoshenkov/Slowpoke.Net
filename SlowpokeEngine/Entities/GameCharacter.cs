using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine
{
    public class GameCharacter
    {
        public Guid Id { get; set; }
        public Guid OwnerUserId { get; set; }

        public GameCharacter() { }

        public GameCharacter(Guid onwerUserId)
        {
            Id = Guid.NewGuid();
            OwnerUserId = onwerUserId;
        }
    }
}
