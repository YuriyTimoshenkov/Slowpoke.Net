using Cabinet.DAL;
using Cabinet.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Cabinet.Services
{
    public class PaymentManager : IPaymentManager
    {
        PaymentContext _paymentContext;
        public PaymentManager(PaymentContext paymentContext)
        {
            _paymentContext = paymentContext;
        }

        public decimal AccountBalance(string userId)
        {
            return _paymentContext.Payments.
                Where(p => p.UserId == userId && p.State == UserPaymentState.Confirmed)
                .Select(p => p.Amount)
                .DefaultIfEmpty(0)
                .Sum(p => p);
        }

        public void Confirm(Guid paymentId)
        {
            var payment = _paymentContext.Payments.FirstOrDefault( p => p.ID == paymentId);
            payment.State = UserPaymentState.Confirmed;

            _paymentContext.Payments.Attach(payment);

            var entry = _paymentContext.Entry(payment);
            //entry.State = EntityState.Modified;

            entry.Property(e => e.State).IsModified = true;

            _paymentContext.SaveChanges(); 
        }

        public UserPayment CreatePayment(string userId, decimal amount)
        {
            var payment = new UserPayment() {
            UserId = userId,
            Amount = amount,
            ID = Guid.NewGuid(),
            State = UserPaymentState.Created,
            Date = DateTime.Now
            };

            _paymentContext.Payments.Add(payment);

            _paymentContext.SaveChanges();

            return payment;
        }
    }
}