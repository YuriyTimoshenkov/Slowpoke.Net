﻿using Cabinet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Cabinet.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;


        public HomeController()
        {
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));
        }
        public ActionResult Index()
        {
            ApplicationUser user = _userManager.FindByNameAsync(User.Identity.Name).Result;

            ViewBag.User = user;

            return View();
        }

        public ActionResult Team()
        {

            ViewBag.Message = "Your application description page.";

            return View();
        }
    }
}