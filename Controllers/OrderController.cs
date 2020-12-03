using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Northwind.Controllers
{
    public class OrderController : Controller
    {
        [Authorize(Roles = "Employee")]
        public IActionResult Index() => View();
    }
}