using System;
using Microsoft.Owin.Hosting;
using Microsoft.AspNet.SignalR;

namespace SlowpokeHostConsole
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			string url = "http://localhost:8080";

			GlobalHost.Configuration.ConnectionTimeout  = new TimeSpan (0, 0, 10);
			GlobalHost.Configuration.DisconnectTimeout  =   new TimeSpan(0, 0, 10);
			GlobalHost.Configuration.KeepAlive          =   new TimeSpan(0, 0, 2);

			using (WebApp.Start(url))
			{
				Console.WriteLine("Server running on {0}", url);
				Console.ReadLine();
			}
		}
	}
}
