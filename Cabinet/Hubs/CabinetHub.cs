using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Cabinet.Models;

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
    }
}