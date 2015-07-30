using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines.View;
using SlowpokeEngine.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NPCClient
{
    class Program
    {
        static readonly string _serverUrl = "http://localhost:8504";
        static IClientMechanicEngine _mechanicEngine = new ClientMechanicEngine();
        static IPlayerEventsProvider _eventProvider;
        static readonly int PingPerSecond = 15;
        static List<Guid> playersIdList = new List<Guid>()
        {
            //Guid.Parse("64428291-1832-481f-b8d2-e6e53ad782be"),
            Guid.Parse("9c4366d2-22ef-4af1-b6d9-f2127dc373b6")
        };

        static void Main(string[] args)
        {
            _eventProvider = new PlayerEventsProvider(_mechanicEngine, PingPerSecond, _serverUrl);

            CreatePlayers();
            _eventProvider.Run();

            Console.ReadLine();

            _eventProvider.Stop();
        }

        static void CreatePlayers()
        {
            foreach(var id in playersIdList)
            {
                NPCAI player = new NPCAI(_mechanicEngine, new Vector(), id);
                
                _mechanicEngine.AddPlayer(player);
                _eventProvider.AddPlayer(player);
            }
        }
    }
}
