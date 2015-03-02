using System;
using SlowpokeEngine;
using SlowpokeEngine.Bodies;

namespace SlowpokeSelfHost
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			var game = new SlowpokeGame ();

			Console.ReadLine ();

			game.StopGame ();
		}
	}
}
