using Cabinet.DAL;
using Cabinet.Hubs;
using Cabinet.Models;
using Cabinet.Services;
using Common;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SlowpokeEngine.DAL;
using SlowpokeHubs;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cabinet.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPaymentManager _paymentManager;


        public HomeController()
        {
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
            _paymentManager = new PaymentManager(new PaymentContext());
        }

        
        public ActionResult Index()
        {
            if (Request.IsAuthenticated)
            {
                ApplicationUser user = _userManager.FindByNameAsync(User.Identity.Name).Result;
                Guid userId = Guid.Parse(User.Identity.GetUserId());

                ViewBag.User = user;

                //Get all character
                var characterRepo = new CharacterRepositoryEF();
                ViewBag.Characters = characterRepo.Find(userId);

                //Get last 10 game sessions
                var gameSessionsRepo = new GameSessionRepositoryEF();
                var gameSessions = gameSessionsRepo.Find(userId).OrderByDescending(v => v.StartTime).Take(10);
                ViewBag.GameSessions = gameSessions;
                ViewBag.GameSessionsCount = gameSessions.Count();
            }

            

            return View();
        }

        [Authorize]
        public ActionResult Crew()
        {
            ViewBag.OnlineUsers = ApplicationUser.GetOnlineUsers();
            return View();
        }

        [Authorize]
        public ActionResult Characters()
        {
            //Get all character
            var characterRepo = new CharacterRepositoryEF();
            var characters = characterRepo.Find(Guid.Parse(User.Identity.GetUserId()), true)
                .Select(v => new ViewModelCharacterListItem () { Name = v.Name, SessionsCount = v.Sessions.Count() });
            ViewBag.CharactersCount = characters.Count();
            ViewBag.Characters = characters;

            return View();
        }

        [Authorize]
        public ActionResult Shop()
        {
            ViewBag.MyAccountBalance = _paymentManager.AccountBalance(User.Identity.GetUserId());

            return View();
        }

        public ActionResult Play(PlayViewModel character)
        {
            string gameServerUrl = System.Configuration.ConfigurationManager.AppSettings["GameServerUrl"];
            string redirectUrl = gameServerUrl + "?token=" + HttpContext.Request.Cookies[SlowpokeHub.TokenCookieName].Value;
            return Redirect(redirectUrl);
        }

        public ActionResult BuyGold(UserPaymentViewModel userPaymentViewModel)
        {
            var payment = _paymentManager.CreatePayment(User.Identity.GetUserId(), userPaymentViewModel.Amount);

            PaymentRequest paymentRequest = new PaymentRequest()
            {
                OrderId = payment.ID,
                Amount = payment.Amount,
                ServiceName = "Gold",
                CompanyName = "Slowpoke",
                CallbackUrl = HttpContext.Request.UrlReferrer + "api/payment/pay/",
                ReturnUrl = HttpContext.Request.UrlReferrer.ToString(),
            };
            
            string paymentRequestQS = paymentRequest.ToString();

            ICryptoProvider cryptoProvider = new SlowpokeCryptoProvider();

            paymentRequest.Sign = cryptoProvider.ComputeHash(paymentRequestQS, "test");

            var redirectUrl = "http://localhost:10127/Payment/Pay?" + paymentRequest.GetFullSignedUrl();

            return Redirect(redirectUrl);
        }
    }
}