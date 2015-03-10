using System;
using Owin;
using Microsoft.Owin.Cors;
using SlowpokeEngine;
using Microsoft.AspNet.SignalR;
using SlowpokeHubs;

namespace SlowpokeHostConsole
{
	class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.UseCors(CorsOptions.AllowAll);
			app.MapSignalR();

            SlowpokeHub.Run();
		}
	}
}

