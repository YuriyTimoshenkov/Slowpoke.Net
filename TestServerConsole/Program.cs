using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TestServerConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var meb = new MechanicEngineBuilder();
            var mechanicEngine = meb.Build();

            mechanicEngine.StartEngine();

            var NPCBuilder = new SimpleBodyBuilder();

            mechanicEngine.AddActiveBody(NPCBuilder.BuildNPC(mechanicEngine));

            var player = mechanicEngine.LoadPlayerBody();
            player.Shoot(1);

            new Task(
                () =>
                {
                    while(true)
                    {
                        player.Move();
                        Console.WriteLine("New Era");
                        foreach (var body in mechanicEngine.ViewPort.GetActiveBodies(player.Id))
                        {
                            Console.WriteLine("Body Id: {0}, new position: {1}", body.Id, body.Position.ToString());
                        }

                        Thread.Sleep(1000);
                    }
                }).Start();

            Console.ReadLine();
        }
    }
}
