using System;
using Owin;
using Microsoft.Owin.Cors;
using SlowpokeEngine;
using Microsoft.AspNet.SignalR;

namespace WebHost
{
	class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.UseCors(CorsOptions.AllowAll);
			app.MapSignalR();

			var meb = new MechanicEngineBuilder ();
			SlowpokeHub.MechanicEngine = meb.Build();

			SlowpokeHub.MechanicEngine.AddNPCBody();

			SlowpokeHub.MechanicEngine.StartEngine();
		}
	}
}

