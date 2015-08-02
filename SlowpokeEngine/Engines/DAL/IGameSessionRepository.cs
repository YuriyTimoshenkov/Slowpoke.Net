using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.DAL
{
    public interface IGameSessionRepository
    {
        void AddSession(GameSession session);
        void CloseSession(Guid sessionId, int score);
        IEnumerable<GameSession> Find(Guid userId);

        IEnumerable<GameSession> FindLastGameSessions(Guid userId, int sessionsCount);

        int CalculateScore();
    }
}
