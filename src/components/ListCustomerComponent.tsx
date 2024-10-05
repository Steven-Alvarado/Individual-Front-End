import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
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
  const [customersPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    listCustomers()
      .then((response) => {
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = customers.filter((customer) => 
      customer.customerId.toString().includes(query) || 
      customer.firstName.toLowerCase().includes(query) || 
      customer.lastName.toLowerCase().includes(query)
    );
    setFilteredCustomers(result);
    setCurrentPage(1);
  }, [searchQuery, customers]);

  const handleAddCustomer = async () => {
    try {
      await addCustomer(formData);
      fetchCustomers();
      setShowAddModal(false);
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleUpdateCustomer = async () => {
    if (!currentCustomer) return;
    try {
      await updateCustomer(currentCustomer.customerId, formData);
      fetchCustomers();
      setShowEditModal(false);
      setCurrentCustomer(null);
      setFormData({ firstName: '', lastName: '', email: '' });
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const Modal: React.FC<{
    show: boolean;
    onClose: () => void;
    title: string;
    onSubmit: () => void;
  }> = ({ show, onClose, title, onSubmit }) => {

    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (show) {
      inputRef.current?.focus(); // Focus the input when the modal opens
    }
  }, [show]);

  if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <Input
            className="mb-2"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <Input
            className="mb-2"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <Input
            className="mb-4"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>
              {title === 'Add Customer' ? 'Add' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    );



  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">

        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>
      
      <Input
        className="mb-4"
        placeholder="Search by ID, First Name, or Last Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">First Name</th>
              <th className="p-4 text-left">Last Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer) => (
              <tr key={customer.customerId} className="border-t">
                <td className="p-4">{customer.customerId}</td>
                <td className="p-4">{customer.firstName}</td>
                <td className="p-4">{customer.lastName}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentCustomer(customer);
                        setFormData({
                          firstName: customer.firstName,
                          lastName: customer.lastName,
                          email: customer.email,
                        });
                        setShowEditModal(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteCustomer(customer.customerId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Customer"
        onSubmit={handleAddCustomer}
      />
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Customer"
        onSubmit={handleUpdateCustomer}
      />
    </div>
  );
};

export default ListCustomerComponent;
