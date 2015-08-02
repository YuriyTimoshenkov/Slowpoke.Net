using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace SlowpokeEngine.DAL
{
    public class GameSessionRepositoryEF : IGameSessionRepository
    {
        public void AddSession(GameSession session)
        {
            using (var _gameStorage = new GameStorage("DefaultConnection"))
            {
                _gameStorage.Sessions.Add(session);
                _gameStorage.SaveChanges();
            }
        }

        public void CloseSession(Guid sessionId, int score)
        {
            using (var _gameStorage = new GameStorage("DefaultConnection"))
            {
                var session = _gameStorage.Sessions.FirstOrDefault(v => v.Id == sessionId);
                session.EndTime = DateTime.Now;
                session.Score = score;

                _gameStorage.SaveChanges();
            }
        }

        public IEnumerable<GameSession> FindLastGameSessions(Guid userId, int sessionsCount)
        {
            using (var _gameStorage = new GameStorage("DefaultConnection"))
            {
                return _gameStorage.Sessions.Include(v => v.Character)
                    .Where(v => v.Character.OwnerUserId == userId)
                    .OrderByDescending(v => v.StartTime).Take(sessionsCount).ToList();
            }
        }

        public IEnumerable<GameSession> Find(Guid userId)
        {
            using (var _gameStorage = new GameStorage("DefaultConnection"))
            {
                return _gameStorage.Sessions.Include(v => v.Character).Where(v => v.Character.OwnerUserId == userId);
            }
        }

        public int CalculateScore()
        {
            using (var _gameStorage = new GameStorage("DefaultConnection"))
            {
                return _gameStorage.Sessions.Sum(v => v.Score);
            }
        }
    }
}