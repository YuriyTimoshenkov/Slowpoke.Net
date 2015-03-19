using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace OctopusPaymentPage.Controllers
{
    [RoutePrefix("paymentapi")]
    public class PaymentApiController : ApiController
    {
        [HttpGet]
        [Route("confirm/{id:Guid}")]
        public bool Confirm(Guid id)
        { 
            string url;
            ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

            if (MvcApplication.CallbackUrls.TryGetValue(id, out url))
            {
                string queryString = id.ToString();
                url += queryString;
                string signQuery = cryptoProvider.ComputeHash(url, "test");

                try
                {
                    return ConfirmMerchant(url, signQuery);
                }
                catch (Exception)
                {
                    return false;
                }
            }
            else
                return false;
        }

        private bool ConfirmMerchant(string url, string sign)
        {
            using (var client = new HttpClient())
            {
                ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Add(cryptoProvider.SignKey, sign);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                ServicePointManager.ServerCertificateValidationCallback +=
    (sender, cert, chain, sslPolicyErrors) => true;

                HttpResponseMessage response = client.GetAsync(string.Empty).Result;

                return response.IsSuccessStatusCode;
            }
        }
    }
}
