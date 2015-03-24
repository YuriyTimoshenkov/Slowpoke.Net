using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine
{
    public class GameSession
    {
        public Guid Id { get; set; }
        public Guid CharacterId { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int Score { get; set; }
        public TimeSpan? Duration 
        {
            get
            {
                return EndTime != null ? EndTime - StartTime : TimeSpan.Zero;
            }
        }

        public GameSession(Guid characterId)
        {
            StartTime = DateTime.Now;
            CharacterId = characterId;
            Id = Guid.NewGuid();
        }
    }
}
