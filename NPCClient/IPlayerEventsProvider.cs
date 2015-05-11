using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NPCClient
{
    public interface IPlayerEventsProvider
    {
        void AddPlayer(NPCAI player);
        void Run();
        void Stop();
    }
}
