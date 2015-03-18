using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cabinet.Models
{
    public class UserPayment
    {
        public Guid ID { get; set; }
        public string UserId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public UserPaymentState State { get; set; }
    }

    public enum UserPaymentState
    {
        Created,
        Confirmed
    }
}