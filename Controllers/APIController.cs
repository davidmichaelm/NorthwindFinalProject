﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class APIController : Controller
    {
        // this controller depends on the NorthwindRepository
        private INorthwindRepository repository;
        public APIController(INorthwindRepository repo) => repository = repo;

        [HttpGet, Route("api/product")]
        // returns all products
        public IEnumerable<Product> Get() => repository.Products.OrderBy(p => p.ProductName);

        [HttpGet, Route("api/product/{id}")]
        // returns specific product
        public Product Get(int id) => repository.Products.FirstOrDefault(p => p.ProductId == id);

        [HttpGet, Route("api/product/discontinued/{discontinued}")]
        // returns all products where discontinued = true/false
        public IEnumerable<Product> GetDiscontinued(bool discontinued) => repository.Products.Where(p => p.Discontinued == discontinued).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product")]
        // returns all products in a specific category
        public IEnumerable<Product> GetByCategory(int CategoryId) => repository.Products.Where(p => p.CategoryId == CategoryId).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product/discontinued/{discontinued}")]
        // returns all products in a specific category where discontinued = true/false
        public IEnumerable<Product> GetByCategoryDiscontinued(int CategoryId, bool discontinued) => repository.Products.Where(p => p.CategoryId == CategoryId && p.Discontinued == discontinued).OrderBy(p => p.ProductName);
        
        [HttpPost, Route("api/addtocart")]
        // adds a row to the cartitem table
        public CartItem Post([FromBody] CartItemJSON cartItem) => repository.AddToCart(cartItem);

        [Authorize(Roles = "Employee"), HttpGet, Route("api/orderdetails")]
        // returns all order details
        public IEnumerable<OrderDetails> GetAllOrderDetails() => repository.OrderDetails.OrderBy(o => o.OrderId);
        
        [Authorize(Roles = "Employee"), HttpGet, Route("api/employee")]
        // returns all employees
        public IEnumerable<Employee> GetAllEmployees() => repository.Employees.OrderBy(e => e.EmployeeId);
        
        [Authorize(Roles = "Employee"), HttpGet, Route("api/shipper")]
        // returns all shippers
        public IEnumerable<Shipper> GetAllShippers() => repository.Shippers.OrderBy(s => s.ShipperId);

        [Authorize(Roles = "Employee"), HttpGet, Route("api/order")]
        // returns all orders
        //public IEnumerable<Order> GetOrder() => repository.Orders.OrderBy(p => p.OrderId);
        public IEnumerable<Order> GetOrders() => repository.Orders.OrderBy(p => p.OrderId);

        [Authorize(Roles = "Employee"), HttpGet, Route("api/order/unshipped")]
        // returns all unshipped orders
        public IEnumerable<Order> GetUnshippedOrders(DateTime? shipped) => repository.Orders.Where(p => p.ShippedDate == null).OrderBy(p => p.OrderId);

        [Authorize(Roles = "Employee"), HttpGet, Route("api/order/{id}")]
        // returns specific order
        public Order GetOrder(int id) => repository.Orders
            .Include(o => o.Customer)
            .Include(o => o.Employee)
            .Include(o => o.Shipper)
            .FirstOrDefault(p => p.OrderId == id);

        [Authorize(Roles = "Employee"), HttpGet, Route("api/orderdetails/{id}")]
        // returns specific order details
        public IEnumerable<OrderDetails> GetOrderDetails(int id) => repository.OrderDetails
            .Include(od => od.Product)
            .Where(od => od.OrderId == id);
    }
}
