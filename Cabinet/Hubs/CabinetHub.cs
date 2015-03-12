using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Cabinet.Models;
using Microsoft.Owin.Security.Cookies;

namespace Cabinet.Hubs
{
    public class CabinetHub : Hub
    {
        private static UserActivityStatusTrackers _userTracker;

        public CabinetHub()
        {
            if (CabinetHub._userTracker == null)
                CabinetHub._userTracker = new UserActivityStatusTrackers();
        }

        public string Hello()
        {
            //Clients.All.updateOnlineUsers("Broadcast message.");
            return "Hello YT";
        }

        public string GetToken()
        {
            return Context.RequestCookies[".AspNet.ApplicationCookie"].Value;
        }
    }
}