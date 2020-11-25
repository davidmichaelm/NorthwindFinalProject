using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class EmployeeController : Controller
    {
        private INorthwindRepository repository;
        
        public EmployeeController(INorthwindRepository repo) => repository = repo;

        [Authorize(Roles = "Employee")]
        public IActionResult Account() => View(repository.Employees.Include("ReportsToEmployee").FirstOrDefault(e => e.Email == User.Identity.Name));
        
        [Authorize(Roles = "Employee"), HttpPost, ValidateAntiForgeryToken]
        public IActionResult Account(Employee employee)
        {
            // Edit customer info
            repository.EditEmployee(employee);
            return RedirectToAction("Index", "Home");
        }
    }
}