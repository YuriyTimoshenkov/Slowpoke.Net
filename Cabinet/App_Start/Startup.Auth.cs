using Cabinet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using System.Data.Entity;

namespace Cabinet
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                SlidingExpiration = false,
                ExpireTimeSpan = ApplicationUser.SessionDuration,
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            app.UseGoogleAuthentication(
                new GoogleOAuth2AuthenticationOptions() 
                {
                    ClientId = "435653818711-f8f47f2re8hlp7tecddltbu3k1gp0ktd.apps.googleusercontent.com",
                    ClientSecret = "SLafHhtu3khQoBcjPoBqVsBp",
                    //CallbackPath = new PathString("/Account/ExternalLoginCallback")
                }
                );
            // Uncomment the following lines to enable logging in with third party login providers
            //app.UseMicrosoftAccountAuthentication(
            //    clientId: "",
            //    clientSecret: "");

            //app.UseTwitterAuthentication(
            //   consumerKey: "",
            //   consumerSecret: "");

            //app.UseFacebookAuthentication(
            //   appId: "",
            //   appSecret: "");
        }
    }
}