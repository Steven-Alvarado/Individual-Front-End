import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/customers';

export const listCustomers = () => axios.get(REST_API_BASE_URL);

export const addCustomer = async (customerData: {
  firstName: string;
  lastName: string;
  email: string;
}) => {
  return await axios.post(REST_API_BASE_URL, customerData);
};


export const updateCustomer = async (
  customerId: number,
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
  }
) => {
  return await axios.put(`${REST_API_BASE_URL}/${customerId}`, customerData); // Corrected syntax for template string
};

export const deleteCustomer = async (customerId: number) => {
  return await axios.delete(`${REST_API_BASE_URL}/${customerId}`); // Corrected syntax for template string
};

