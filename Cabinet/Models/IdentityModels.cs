using Microsoft.AspNet.Identity.EntityFramework;
using SlowpokeHubs;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Cabinet.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public DateTime LastAuth { get; set; } 

        public ApplicationUser():base()
        {
            LastAuth = DateTime.Now;
        }

        public static List<ApplicationUser> GetOnlineUsers()
        {
            List<ApplicationUser> result = null;

            using (var dbContext = new ApplicationDbContext())
            {
                result = dbContext.Users.Where(user => DbFunctions.DiffSeconds(user.LastAuth, DateTime.Now) < SlowpokeHub.TokentDuration.TotalSeconds).ToList();
            }

            return result;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
    }
}