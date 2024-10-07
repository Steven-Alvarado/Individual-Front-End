import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';  
import { Input } from './ui/input';    
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react';  // Icons
import { listCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/CustomerService';

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  createDate: string;
  lastUpdate: string;
}

interface CustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  
}

const ListCustomerComponent: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);  // Pagination size
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);  // For editing a customer
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '' 
  });

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    listCustomers()
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data);  // Show all customers initially
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  };

  // Search function: Filters customers based on ID, first name, or last name
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = customers.filter((customer) =>
      customer.customerId.toString().includes(query) ||
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query)
    );
    setFilteredCustomers(result);
    setCurrentPage(1);  // Reset to page 1 after search
  }, [searchQuery, customers]);

  // Get customers for the current page
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Handle adding a new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer(formData);  // Call addCustomer service
      setShowAddModal(false);       // Close modal
      fetchCustomers();             // Refresh customer list
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  // Handle updating an existing customer
  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCustomer) {
      try {
        await updateCustomer(currentCustomer.customerId, formData);  // Call update service
        setShowEditModal(false);  // Close modal
        fetchCustomers();         // Refresh customer list
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteCustomer(customerId);  // Call delete service
      fetchCustomers();                  // Refresh customer list
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle edit button click (populate form with existing customer data)
  const handleEditClick = (customer: Customer) => {
    setCurrentCustomer(customer);  // Set current customer for editing
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email
      
    });
    setShowEditModal(true);  // Open edit modal
  };

  // Handle pagination change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-20 p-4 center">
    

      {/* Search bar */}
      <div className="mb-4">
        <Input 
          type="text"
          placeholder= "Search by ID, first name, or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <Button onClick={() => setShowAddModal(true)} className="mb-4 flex items-center justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        <UserPlus className="h-4 w-4 mr-2 " /> Add Customer
      </Button>

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full text-left border-collapse">
          <thead>
            <tr className="border">
              <th className="px-4 py-2 bg-gray-50">ID</th>
              <th className="px-4 py-2 ">First Name</th>
              <th className="px-4 py-2 bg-gray-50">Last Name</th>
              <th className="px-4 py-2 ">Email</th>
              <th className="px-4 py-2 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customerId} className="border">
                <td className="px-4 py-2  bg-gray-50">{customer.customerId}</td>
                <td className="px-4 py-2 ">{customer.firstName}</td>
                <td className="px-4 py-2  bg-gray-50">{customer.lastName}</td>
                <td className="px-4 py-2 ">{customer.email}</td>
                <td className="px-4 py-2  bg-gray-50">

                  {/*Edit Customer*/}
                  <Button 
                  onClick={() => handleEditClick(customer)} className="mr-1 justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/*Delete Customer*/ }
                  <Button className="mr-1 justify-center items-center bg-white text-red-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  onClick={() => handleDeleteCustomer(customer.customerId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* View Details */}
                  <Button className=" mr-1 justify-center items-center bg-white text-black-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  onClick={() => viewCustomer(customer.customerId)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">

        <Button className=" justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <span>Page {currentPage} of {totalPages}</span>
        <Button className="justify-center items-center bg-white text-blue-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 shadow-md rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Customer</h2>
            <form onSubmit={handleAddCustomer} className="">
              <div className="mb-4">
                <label className="block mb-2">First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setShowAddModal(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 text-white">
                  Add Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer}>
              <div className="mb-4">
                <label className="block mb-2">First Name:</label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Last Name:</label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email:</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="button" onClick={() => setShowEditModal(false)} className="mr-2">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 text-white">
                  Update Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCustomerComponent;
