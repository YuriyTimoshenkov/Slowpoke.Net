using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;
using System.Text;
using System.Security.Cryptography;
using Common;

namespace OctroOctopusPaymentPage
{
    public class PaymentPageAuthFilter: ActionFilterAttribute, IAuthenticationFilter
    {
        public void OnAuthentication(AuthenticationContext filterContext)
        {
            ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

            var qsCollection = filterContext.RequestContext.HttpContext.
                Request.QueryString;

            var receivedSign = qsCollection[cryptoProvider.SignKey];

            if (receivedSign == null)
                return;

            string qs = qsCollection.ToString();

            var stringToSign = qs.Remove(qs.IndexOf("&" + cryptoProvider.SignKey));

            stringToSign = HttpUtility.UrlDecode(stringToSign);

            var calculatedHash = cryptoProvider.ComputeHash(stringToSign, "test");

            if (receivedSign != calculatedHash)
                filterContext.Result = new HttpUnauthorizedResult();
        }

        public void OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
        {

        }
    }
}