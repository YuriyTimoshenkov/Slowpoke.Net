using Cabinet.Services;
using Common;
using OctopusPaymentPage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Cabinet.Controllers
{
    [RoutePrefix("api/payment")]
    public class PaymentController : ApiController
    {
        [PaymentPageAuthFilterApi]
        [HttpGet]
        [Route("pay/{id:guid}")]
        public void Pay(Guid id)
        {
            var paymentManager = new PaymentManager(new DAL.PaymentContext());

            paymentManager.Confirm(id);
        }
    }
}
