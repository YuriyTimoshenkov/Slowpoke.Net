using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Common
{
    public class PaymentRequest
    {
        public Guid? OrderId { get; set; }
        public decimal? Amount { get; set; }
        public string CallbackUrl { get; set; }
        public string ReturnUrl { get; set; }
        public string CompanyName { get; set; }
        public string ServiceName { get; set; }
        public string Sign { get; set; }
        
        public override string ToString()
        {
            return  "OrderId=" + OrderId
                    + "&Amount=" + Amount
                    + "&CallbackUrl=" + CallbackUrl
                    + "&ReturnUrl=" + ReturnUrl
                    + "&CompanyName=" + CompanyName
                    + "&ServiceName=" + ServiceName;
        }

        public string GetFullSignedUrl()
        {
            return "OrderId=" + OrderId
                    + "&Amount=" + Amount
                    + "&CallbackUrl=" + HttpUtility.UrlEncode(CallbackUrl)
                    + "&ReturnUrl=" + HttpUtility.UrlEncode(ReturnUrl)
                    + "&CompanyName=" + CompanyName
                    + "&ServiceName=" + ServiceName + "&Sign=" + Sign;
        }
    }
}