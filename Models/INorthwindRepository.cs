using System.Linq;

namespace Northwind.Models
{
    public interface INorthwindRepository
    {
        IQueryable<Category> Categories { get; }
        IQueryable<Product> Products { get; }
        IQueryable<Discount> Discounts { get; }
        IQueryable<Customer> Customers { get; }
        IQueryable<Order> Orders { get; }
        IQueryable<OrderDetails> OrderDetails { get; }
        IQueryable<Employee> Employees { get; }
        IQueryable<Shipper> Shippers { get; }

        void AddCustomer(Customer customer);
        void EditCustomer(Customer customer);
        CartItem AddToCart(CartItemJSON cartItemJSON);
        void EditEmployee(Employee employee);
    }
}
