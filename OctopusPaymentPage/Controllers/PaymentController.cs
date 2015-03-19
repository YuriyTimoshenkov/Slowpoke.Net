using Common;
using Newtonsoft.Json;
using OctroOctopusPaymentPage;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace OctopusPaymentPage.Controllers
{
    public class PaymentController : Controller
    {
        [PaymentPageAuthFilter]
        public ActionResult Pay(PaymentRequest request)
        {
            ViewBag.AppValue = request;

            if(request.OrderId != null)
                MvcApplication.CallbackUrls.Add((Guid)request.OrderId, request.CallbackUrl);

            return View();
        }

        public ActionResult GenerateLink()
        {
            PaymentRequest request = new PaymentRequest() 
            {
                OrderId = Guid.NewGuid(),
                 Amount = (decimal)66.66,
                  ServiceName = "Gold",
                   CompanyName = "Slowpoke",
                CallbackUrl = "http://localhost:1103/api/payment/pay/",
                ReturnUrl = "http://localhost:10127/Payment/GenerateLink",
            };

            string queryString = request.ToString();

            ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

            string hashQS = cryptoProvider.ComputeHash(queryString, "test");

            ViewBag.orderId = request.OrderId;
            ViewBag.amount = request.Amount;
            ViewBag.callbackUrl = request.CallbackUrl;
            ViewBag.returnUrl = request.ReturnUrl;
            ViewBag.companyName = request.CompanyName;
            ViewBag.serviceName = request.ServiceName;
            ViewBag.sign = hashQS;

            return View();
        }
    }
}
