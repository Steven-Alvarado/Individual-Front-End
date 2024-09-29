import React, { useEffect, useState } from 'react';
import { listCustomers } from '../services/CustomerService';

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  createDate: string;
  lastUpdate: string;
}

const ListCustomerComponent: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20); // Set number of customers per page

  useEffect(() => {
    listCustomers()
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Calculate total number of pages
  const totalPages = Math.ceil(customers.length / customersPerPage);

  // Get current customers for pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page when left or right arrows are clicked
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-6">Customers</h1>
        <div className="overflow-x-auto max-h-96">
        <table className="table-auto w-full divide-y bg-white  shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">Customer ID</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              
              <th className="px-4 py-2">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customerId} className="border-t">
                <td className="px-4 py-2 border border-gray-300">{customer.customerId}</td>
                <td className="px-4 py-2 border border-gray-300">{customer.firstName}</td>
                <td className="px-4 py-2 border border-gray-300">{customer.lastName}</td>
                <td className="px-4 py-2 border border-gray-300">{customer.email}</td>
                
                <td className="px-4 py-2">{customer.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          {/* Left Arrow */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded bg-gray-200 ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500 hover:text-white'
            }`}
          >
            &larr; Previous
          </button>

          {/* Page Indicator */}
          <div className="text-center">
            <span className="text-white">{currentPage} / {totalPages}</span>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded bg-gray-200 ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500 hover:text-white'
            }`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCustomerComponent;

