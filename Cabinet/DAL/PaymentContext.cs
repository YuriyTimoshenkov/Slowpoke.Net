using Cabinet.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Cabinet.DAL
{
    public class PaymentContext : DbContext
    {
        public PaymentContext()
            : base("DefaultConnection")
        {

        }

        public DbSet<UserPayment> Payments { get; set; }
    }
}