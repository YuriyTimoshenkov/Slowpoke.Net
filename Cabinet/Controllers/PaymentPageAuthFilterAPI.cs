using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Text;
using System.Security.Cryptography;
using System.Web.Http.Filters;
using System.Threading.Tasks;
using System.Web.Http.Results;
using System.Net.Http.Headers;
using Common;

namespace OctopusPaymentPage
{
    public class PaymentPageAuthFilterApi: ActionFilterAttribute, IAuthenticationFilter
    {
        public Task AuthenticateAsync(HttpAuthenticationContext context, System.Threading.CancellationToken cancellationToken)
        {
            IEnumerable<string> headers;
            ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

            if (context.Request.Headers.TryGetValues(cryptoProvider.SignKey, out headers))
            {
                var signReceived = headers.First();
                var calculatedSign = cryptoProvider.ComputeHash(context.Request.RequestUri.OriginalString, "test");
             }
            else
            {
                context.ErrorResult = context.ErrorResult = new UnauthorizedResult(
            new AuthenticationHeaderValue[0], context.Request);
            }
            
            return Task.FromResult(0);
        }

        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, System.Threading.CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }
    }
}