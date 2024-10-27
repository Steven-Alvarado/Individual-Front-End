import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';  
import { Input } from './ui/input';    
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react';  // Icons
import { listCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/CustomerService';

interface Rental {
  rentalId: number;
  rentalDate: string;
  returnDate: string | null;
  filmTitle: string;
  staffId: number;
}

interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string; 
  rentals?: Rental[];
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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

  const handleViewDetailsClick = (customer: Customer) => {
    setCurrentCustomer(customer);  // Set current film for details
    setShowDetailsModal(true);  // Open modal to show film details
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

      <Button onClick={() => setShowAddModal(true)} className="mb-4 flex items-center justify-center items-center bg-gray-800 text-teal-300 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        <UserPlus className="h-4 w-4 mr-2 " /> Add Customer
      </Button>

      {/* Customer Table */}
      <div className="overflow-x-auto border shadow-lg border-gray-800">
        <table className="table-auto min-w-full h-16 text-left border-collapse">
          <thead>
            <tr className="border border-gray-800">
              <th className="px-4 py-2 w-16 bg-white">ID</th>
              <th className="px-4 py-2 w-32 bg-white">First Name</th>
              <th className="px-4 py-2 w-32 bg-white">Last Name</th>
              <th className="px-4 py-2 w-1/2 bg-white">Email</th>
              <th className="px-4 py-2 w-1/6 bg-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customerId} className="border border-gray-800">
                <td className="px-4 py-2  w-16 bg-white">{customer.customerId}</td>
                <td className="px-4 py-2  w-32 bg-white">{customer.firstName}</td>
                <td className="px-4 py-2  w-32 bg-white">{customer.lastName}</td>
                <td className="px-4 py-2  w-1/2 bg-white">{customer.email}</td>
                <td className="px-4 py-2 bg-white">

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
                  onClick={() => handleViewDetailsClick(customer)}>
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

        <Button className=" justify-center items-center bg-gray-800 text-teal-300 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <span className="text-teal-300 text-semibold"> {currentPage} of {totalPages}</span>
        <Button className="justify-center items-center bg-gray-800 text-teal-300 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                <Button type="submit" className=" border border-gray-800 bg-gray-800 text-teal-300">
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

      {/* View Details Modal */}
      {showDetailsModal && currentCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl text-left w-full relative">
          
            <h2 className="text-2xl font-semibold mb-4 text-left">{currentCustomer.firstName} {currentCustomer.lastName}</h2>
            <p><strong>Email:</strong> {currentCustomer.email}</p>
            <p><strong>Account Created:</strong> {new Date(currentCustomer.createDate).toLocaleDateString()}</p>

            <p><strong>Address:</strong> {currentCustomer.address}, {currentCustomer.city}, {currentCustomer.country}, {currentCustomer.postalCode}</p>
            <p><strong>Phone:</strong> {currentCustomer.phone}</p>
             {/* Rental History */}
             <h3 className="text-xl font-semibold mt-6 mb-4">Rental History</h3>
             <div className="overflow-y-auto max-h-64">
               <div className="flex justify-end">
                 <Button type="button" onClick={() => setShowDetailsModal(false)} className="mr-2 rounded-lg border hover:bg-blue-100">
                   Close
                 </Button>
               </div>
               <table className="table-auto w-full text-left border-collapse">
                 <thead>
                   <tr>
                     <th className="border px-4 py-2">Rental ID</th>
                     <th className="border px-4 py-2">Rental Date</th>
                     <th className="border px-4 py-2">Return Date</th>
                     <th className="border px-4 py-2">Film Title</th>
                   </tr>
                 </thead>
                 <tbody>
                 
                     {currentCustomer.rentals
                       ?.sort((a, b) => {
                         // Sort by null returnDate first, then by rentalDate
                         if (a.returnDate === null && b.returnDate !== null) return -1;
                         if (a.returnDate !== null && b.returnDate === null) return 1;
                         return new Date(a.rentalDate).getTime() - new Date(b.rentalDate).getTime();
                       })
                       .map((rental) => (
                         <tr key={rental.rentalId}>
                           <td className="border px-4 py-2">{rental.rentalId}</td>
                           <td className="border px-4 py-2">{new Date(rental.rentalDate).toLocaleDateString()}</td>
                           <td className="border px-4 py-2">
                             {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : 'N/A'}
                           </td>
                           <td className="border px-4 py-2">{rental.filmTitle}</td>
                         </tr>
                       ))}
                       
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       )}





     </div>
   );
};

export default ListCustomerComponent;
