using Microsoft.AspNet.Identity.EntityFramework;
using System;

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
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }
    }
}