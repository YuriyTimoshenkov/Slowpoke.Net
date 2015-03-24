using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.Entities.Factories
{
    public class SimpleCharacterFactory : ICharacterFactory
    {
        public GameCharacter Create(Guid ownerUserId)
        {
            return new GameCharacter(ownerUserId);
        }
    }
}
