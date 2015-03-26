using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace SlowpokeEngine.DAL
{
    public class CharacterRepositoryEF : ICharacterRepository
    {
        private GameStorage _gameStorage;

        public CharacterRepositoryEF()
        {
            _gameStorage = new GameStorage("DefaultConnection");
        }

        public IEnumerable<GameCharacter> Find(Guid ownerUserId, bool loadDependencies = false)
        {
            if (loadDependencies)
            {
                return _gameStorage.Characters.Include(v => v.Sessions).Where(character => character.OwnerUserId == ownerUserId);
            }
            else
            {
                return _gameStorage.Characters.Where(character => character.OwnerUserId == ownerUserId);
            }
        }

        public void Add(GameCharacter character)
        {
            _gameStorage.Characters.Add(character);
            _gameStorage.SaveChanges();
        }
    }
}