using Cabinet.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Web;

namespace Cabinet.Hubs
{
    public class UserActivityStatusTrackers
    {
        private Timer _timer;
        private IEnumerable<string> _onlineUsers;
       

        public UserActivityStatusTrackers()
        {
            _onlineUsers = new List<string>();
            _timer = new Timer(UpdateUserStatus, null, 0, 10000);
        }

        private void UpdateUserStatus(object state)
        {
            using (var dbContext = new ApplicationDbContext())
            {
                var users = ApplicationUser.GetOnlineUsers();
                var newOnlineUsers = users.Select(user => user.UserName);

                if (!Enumerable.SequenceEqual<string>(_onlineUsers, newOnlineUsers))
                {
                    var clients = GlobalHost.ConnectionManager.GetHubContext<CabinetHub>().Clients;
                    clients.All.updateOnlineUsers(newOnlineUsers.ToList());

                    _onlineUsers = newOnlineUsers;
                }
            }

            
        }
    }
}