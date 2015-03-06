using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Cabinet.Startup))]
namespace Cabinet
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
