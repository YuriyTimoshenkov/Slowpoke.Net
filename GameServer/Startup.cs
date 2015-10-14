using Common;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Newtonsoft.Json;
using Owin;
using SlowpokeHubs;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

[assembly: OwinStartupAttribute(typeof(GameServer.Startup))]
namespace GameServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.Use(async (Context, next) =>
            {
                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("en-EN");

                var token = Context.Request.Query.Get("token");
                if (token != null)
                {
                    Context.Response.Cookies.Append(SlowpokeHub.TokenCookieName, token);
                    Context.Response.Redirect("\\Static\\Slowpoke.html");
                }
                else
                {
                    await next.Invoke();
                }
            });

            ConfigureAuth(app);
            GlobalHost.Configuration.MaxIncomingWebSocketMessageSize = int.MaxValue;

            GlobalHost.Configuration.DisconnectTimeout = TimeSpan.FromSeconds(18);
            GlobalHost.Configuration.KeepAlive = TimeSpan.FromSeconds(5);
            GlobalHost.Configuration.DefaultMessageBufferSize = int.MaxValue;


            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);

                var hubConfiguration = new HubConfiguration();
                hubConfiguration.EnableDetailedErrors = true;

                var serializerSettings = new JsonSerializerSettings();
                serializerSettings.TypeNameHandling = TypeNameHandling.Objects;

                var serializer = JsonSerializer.Create(serializerSettings);
                GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);

                map.RunSignalR(hubConfiguration);
            });

            SlowpokeHub.Run(new NLogAdapter("Slowpoke.Log"));
        }
    }
}
