using System;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;

namespace SlowpokeSelfHost
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			var factory = new SlowpokeFactory ();
			var game = factory.BuildGame ();

			game.AddNPC (new NPC ());

			Console.ReadLine ();

			game.StopGame ();
		}
	}
}
