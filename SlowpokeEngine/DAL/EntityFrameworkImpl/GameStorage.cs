using SlowpokeEngine.Bodies;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SlowpokeEngine.DAL
{
    public class GameStorage : DbContext
    {
        public GameStorage(string connectionString)
            : base(connectionString)
        {

        }

        public DbSet<GameSession> Sessions { get; set; }
        public DbSet<GameCharacter> Characters { get; set; }
    }
}
