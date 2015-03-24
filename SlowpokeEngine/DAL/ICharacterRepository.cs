using SlowpokeEngine.Bodies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.DAL
{
    public interface ICharacterRepository
    {
        GameCharacter Find(Guid userId);
        void Add(GameCharacter character);
    }
}
