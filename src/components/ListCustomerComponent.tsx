import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MoreHorizontal, Pencil, Trash2, UserPlus } from 'lucide-react';  // Icons
import { listCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/CustomerService';
import { returnFilm } from '../services/FilmService';

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
  address: string;
  city: string;
  district: string;
  country: string;
  postalCode: string;
  phone: string;

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
  // State to store the film ID to return and any error messages
  const [rentalIdToReturn, setFilmIdToReturn] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    district: '',
    country: '',
    postalCode: '',
    phone: ''
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
const [customerIdToDelete, setCustomerIdToDelete] = useState<number | null>(null);


// Trigger the confirmation modal
const handleDeleteClick = (customerId: number) => {
  setCustomerIdToDelete(customerId);
  setShowDeleteConfirmModal(true);
};

// Confirm deletion after user confirms
const confirmDeleteCustomer = async () => {
  if (customerIdToDelete !== null) {
    await handleDeleteCustomer(customerIdToDelete);
    setShowDeleteConfirmModal(false);  // Close the modal
    setCustomerIdToDelete(null);       // Reset the customer ID
  }
};
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
      email: customer.email,
      address: customer.address,
      city: customer.city,
      district: customer.district,
      country: customer.country,
      postalCode: customer.postalCode,
      phone: customer.phone
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

  // Handler function to process the return
  const handleReturnFilm = () => {
    const rental = currentCustomer.rentals.find(r => r.rentalId === parseInt(rentalIdToReturn));

    if (!rental) {
      setErrorMessage('Rental ID not found in rental history.');
      return;
    }

    if (rental.returnDate !== null) {
      setErrorMessage('This rental has already been returned.');
      return;
    }

    // Call the API to return the film (assuming a returnFilm function is defined)
    returnFilm(parseInt(rentalIdToReturn))
      .then(() => {
        alert(`Film ID ${rentalIdToReturn} returned successfully.`);
        setErrorMessage('');
        setFilmIdToReturn(''); // Clear input field
        // Optionally, update the rental history to show the returned status
      })
      .catch((error) => {
        console.error('Error returning film:', error);
        setErrorMessage('There was an issue returning the film. Please try again.');
      });
  };


  return (
    <div className="container mx-auto py-20 p-4 center">


      {/* Search bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by ID, first name, or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <Button onClick={() => setShowAddModal(true)} className="mb-4 flex items-center justify-center items-center bg-gray-800 text-teal-300 border border-gray-800 rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
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

                  {/*Delete Customer*/}
                  <Button className="mr-1 justify-center items-center bg-white text-red-600 border rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onClick={() => handleDeleteClick(customer.customerId)}>
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

        <Button className=" justify-center items-center bg-gray-800 text-teal-300 border border-gray-800 rounded-lg shadow hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <span className="text-teal-300 text-semibold"> {currentPage} of {totalPages}</span>
        <Button className="justify-center items-center bg-gray-800 text-teal-300 border rounded-lg shadow border-gray-800 hover:bg-blue-100 active:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 w-full bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 shadow-md rounded w-1/5  shadow-lg">
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


              <div className="flex justify-end justify-center py-2 items-center">
                <Button type="button" onClick={() => setShowAddModal(false)} className="mr-2 border border-gray-800 text-semibold text-teal-300 bg-gray-800 hover:bg-blue-100">
                  Cancel
                </Button>
                <Button type="submit" className="border border-gray-800 bg-gray-800 text-teal-300 hover:bg-blue-100">
                  Add Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
{showDeleteConfirmModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
      <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
      <p className="mb-6">Do you really want to delete Customer ID {customerIdToDelete}</p>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={confirmDeleteCustomer}
          className="px-4 py-2 bg-gray-800 text-teal-300 rounded-lg shadow border border-gray-800 hover:bg-red-600"
        >
          Yes, Delete
        </Button>
        <Button
          onClick={() => setShowDeleteConfirmModal(false)}
          className="px-4 py-2 bg-gray-800 text-teal-300 rounded-lg shadow hover:bg-gray-400"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

{/* Edit Customer Modal */}
{showEditModal && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-8 rounded w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Customer</h2>
      <form onSubmit={handleUpdateCustomer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Personal Information Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">First Name</label>
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
              <label className="block mb-1 font-medium">Last Name</label>
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
              <label className="block mb-1 font-medium">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Phone</label>
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Address Information Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Address Info</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">City</label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">District</label>
              <Input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Country</label>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Postal Code</label>
              <Input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 border border-gray-800 text-teal-300 bg-gray-800 rounded-lg hover:bg-blue-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-gray-800 border border-gray-800 text-teal-300 rounded-lg hover:bg-blue-100"
          >
            Update Customer
          </Button>
        </div>
      </form>
    </div>
  </div>
)}




      {/* View Details Modal */}
      {showDetailsModal && currentCustomer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl text-left w-full relative">
            {/* Title and Close Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {currentCustomer.firstName} {currentCustomer.lastName}
              </h2>
              <Button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="text-teal-300 bg-gray-800 hover:bg-blue-100 rounded-lg p-2"
                aria-label="Close"
              >
                Close
              </Button>
            </div>

            {/* Customer Info */}
            <p><strong>Email:</strong> {currentCustomer.email}</p>
            <p><strong>Account Created:</strong> {new Date(currentCustomer.createDate).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {currentCustomer.address}, {currentCustomer.city}, {currentCustomer.country}, {currentCustomer.postalCode}</p>
            <p><strong>Phone:</strong> {currentCustomer.phone}</p>

            {/* Return Film Section */}
            <h3 className="text-xl font-semibold mt-6 mb-4">Return a Film</h3>
            <div className="flex items-center mb-4">
              <Input
                type="text"
                placeholder="Enter rental ID"
                value={rentalIdToReturn}
                onChange={(e) => setFilmIdToReturn(e.target.value)}
                className="w-full p-2 border rounded mr-2"
              />
              <Button
                type="button"
                onClick={handleReturnFilm}
                className="bg-gray-800 text-teal-300 rounded-lg shadow hover:bg-blue-100 border border-gray-800"
              >
                Return
              </Button>
            </div>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Rental History */}
            <h3 className="text-xl font-semibold mt-6 mb-4">Rental History</h3>
            <div className="overflow-y-auto max-h-64">
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
