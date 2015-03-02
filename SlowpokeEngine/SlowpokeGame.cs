using System;
using SlowpokeEngine.Bodies;
using SlowpokeEngine.Engines;

namespace SlowpokeEngine
{
	public class SlowpokeGame
	{
		private readonly IMechanicEngine _mechanicEngine;

		public SlowpokeGame()
		{
			var meb = new MechanicEngineBuilder ();
			_mechanicEngine = meb.Build();

			_mechanicEngine.AddNPCBody ();

			_mechanicEngine.StartEngine ();
		}

		public void StopGame()
		{
			_mechanicEngine.StopEngine ();
		}
	}
}

