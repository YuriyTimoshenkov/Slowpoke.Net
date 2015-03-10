using Microsoft.Owin;
using Owin;
using SlowpokeHubs;

[assembly: OwinStartupAttribute(typeof(Cabinet.Startup))]
namespace Cabinet
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();


            SlowpokeHub.Run();
        }
    }
}
