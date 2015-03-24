﻿using SlowpokeEngine.Engines;
using SlowpokeEngine.Bodies;

namespace SlowpokeEngine
{
	public class SimpleMechanicEngineBuilder : IMechanicEngineBuilder
	{
		public IMechanicEngine Build()
		{
			var mapEngine = new MapEngine ();
			var physicalEngine = new PhysicalEngine (new ShapeCollisionManager(), mapEngine);
			var simpleBodyBuilder = new SimpleBodyBuilder ();
			var viewPort = new ViewPort (mapEngine);

			var mechanicEngine = new MechanicEngine (physicalEngine, mapEngine, simpleBodyBuilder, viewPort);

			return mechanicEngine;
		}
	}
}