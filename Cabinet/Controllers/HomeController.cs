using Cabinet.Hubs;
using Cabinet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
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


        public HomeController()
        {
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
        }

        [AuthorizeYT]
        public ActionResult Index()
        {
            ApplicationUser user = _userManager.FindByNameAsync(User.Identity.Name).Result;

            ViewBag.User = user;

            return View();
        }

        [Authorize]
        public ActionResult Crew()
        {
            ViewBag.OnlineUsers = ApplicationUser.GetOnlineUsers();
            return View();
        }
    }
}