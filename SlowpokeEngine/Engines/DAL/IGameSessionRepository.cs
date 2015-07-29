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
        void CloseSession(Guid sessionId);
        IEnumerable<GameSession> Find(Guid userId);

        int CalculateScore();
    }
}
