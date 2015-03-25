using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SlowpokeEngine.DAL
{
    public class CharacterRepositoryEF : ICharacterRepository
    {
        private GameStorage _gameStorage;

        public CharacterRepositoryEF()
        {
            _gameStorage = new GameStorage("DefaultConnection");
        }

        public IEnumerable<GameCharacter> Find(Guid ownerUserId)
        {
            return _gameStorage.Characters.Where(character => character.OwnerUserId == ownerUserId);
        }

        public void Add(GameCharacter character)
        {
            _gameStorage.Characters.Add(character);
            _gameStorage.SaveChanges();
        }
    }
}