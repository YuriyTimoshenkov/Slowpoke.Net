using Cabinet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cabinet.Services
{
    public interface IPaymentManager
    {
        UserPayment CreatePayment(string userId, decimal amount);
        decimal AccountBalance(string userId);

        void Confirm(Guid paymentId);
    }
}