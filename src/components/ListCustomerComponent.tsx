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
  const [customersPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState(''); // State to handle search query
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    listCustomers()
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data); // Initially, display all customers
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Filter customers based on search query (by ID, first name, or last name)
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = customers.filter((customer) => 
      customer.customerId.toString().includes(query) || 
      customer.firstName.toLowerCase().includes(query) || 
      customer.lastName.toLowerCase().includes(query)
    );
    setFilteredCustomers(result);
    setCurrentPage(1); // Reset to the first page when searching
  }, [searchQuery, customers]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

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
        
        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by ID, First Name, or Last Name"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="table-auto w-full divide-y bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Customer ID</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr key={customer.customerId} className="border-t">
                    <td className="px-4 py-2 border border-gray-300">{customer.customerId}</td>
                    <td className="px-4 py-2 border border-gray-300">{customer.firstName}</td>
                    <td className="px-4 py-2 border border-gray-300">{customer.lastName}</td>
                    <td className="px-4 py-2 border border-gray-300">{customer.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded bg-gray-200 ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-500 hover:text-white'
            }`}
          >
            &larr; Previous
          </button>
          <div className="text-center">
            <span className="text-white">{currentPage} / {totalPages}</span>
          </div>
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

