using System;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;
using System.Threading.Tasks;
using SlowpokeEngine.Actions;
using System.Threading;
using System.Linq;

namespace SlowpokeSelfHost
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			var meb = new MechanicEngineBuilder ();
			var mechanicEngine = meb.Build();

			mechanicEngine.AddNPCBody ();

			mechanicEngine.StartEngine ();

			var player = mechanicEngine.LoadPlayerBody();

			new Task (() => {
				while(true)
				{
					player.ProcessAction(new BodyActionMove());
					Console.WriteLine("Current world state:");

				

					foreach(var item in mechanicEngine.ViewPort.GetActiveBodies(player.Id))
					{
						Console.WriteLine("Body id: {0}, position: {1}", item.Id, item.Position.ToString());
					}

					Thread.Sleep(1000);
				}
			}).Start ();

			Console.ReadLine ();

			mechanicEngine.StopEngine ();
		}
	}
}
