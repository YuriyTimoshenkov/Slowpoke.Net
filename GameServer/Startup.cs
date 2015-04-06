using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using SlowpokeHubs;
using System;

[assembly: OwinStartupAttribute(typeof(GameServer.Startup))]
namespace GameServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.Use(async (Context, next) =>
            {
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
            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableDetailedErrors = true;
            
            app.MapSignalR(hubConfiguration);

            SlowpokeHub.Run();
        }
    }
}
