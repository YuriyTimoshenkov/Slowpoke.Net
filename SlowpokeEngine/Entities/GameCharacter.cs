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

        public ICollection<GameSession> Sessions { get; set; }

        public string Name { get; set; }

        public GameCharacter() { }

        public GameCharacter(Guid onwerUserId, string name)
        {
            Id = Guid.NewGuid();
            OwnerUserId = onwerUserId;
            Name = name;
        }
    }
}
