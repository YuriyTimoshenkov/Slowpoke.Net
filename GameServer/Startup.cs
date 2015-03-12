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
            app.MapSignalR();


            SlowpokeHub.Run();
        }
    }
}
