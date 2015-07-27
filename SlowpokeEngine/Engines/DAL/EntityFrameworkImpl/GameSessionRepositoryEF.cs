using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace SlowpokeEngine.DAL
{
    public class GameSessionRepositoryEF : IGameSessionRepository
    {
        private GameStorage _gameStorage;

        public GameSessionRepositoryEF()
        {
            _gameStorage = new GameStorage("DefaultConnection");
        }

        public void AddSession(GameSession session)
        {
            _gameStorage.Sessions.Add(session);
            _gameStorage.SaveChanges();
        }

        public void CloseSession(Guid sessionId)
        {
            var session = _gameStorage.Sessions.FirstOrDefault(v => v.Id == sessionId);
            session.EndTime = DateTime.Now;

            _gameStorage.SaveChanges();
        }

        public IEnumerable<GameSession> Find(Guid userId)
        {
            return _gameStorage.Sessions.Include(v => v.Character).Where(v => v.Character.OwnerUserId == userId);
        }

        public int CalculateScore()
        {
            return _gameStorage.Sessions.Sum(v => v.Score);
        }
    }
}