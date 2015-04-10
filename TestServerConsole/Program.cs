using MathNet.Numerics.LinearAlgebra;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.DAL;
using SlowpokeEngine.Engines;
using SlowpokeEngine.Entities;
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
            var meb = new UnityMechanicEngineBuilder();
            var mechanicEngine = meb.Build();

            mechanicEngine.StartEngine(null);

            var player = mechanicEngine.LoadPlayerBody(Guid.NewGuid());
            player.Shoot();

            new Task(
                () =>
                {
                    while(true)
                    {
                        player.Move(new Vector(1,1));
                        player.ChangeDirection(new Vector(1, 1));
                        Console.WriteLine("New Era");
                        foreach (var body in mechanicEngine.ViewPort.GetFrame(player.Id).Bodies)
                        {
                            Console.WriteLine("Body Id: {0}, new position: {1}", body.Id, body.Shape.Position.ToString());
                        }

                        Thread.Sleep(1000);
                    }
                }).Start();

            Console.ReadLine();
        }
    }
}
