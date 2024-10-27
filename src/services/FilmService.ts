import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api';

export const listFilms = () => axios.get(`${REST_API_BASE_URL}/films`);

export const listTop5Films = () => axios.get(`${REST_API_BASE_URL}/films/top5`);

export const getFilmInventory = (filmId: number) => axios.get(`${REST_API_BASE_URL}/inventory/availability/${filmId}`);

export const rentFilmToCustomer = (filmId: number, customerId: number) => axios.post(`${REST_API_BASE_URL}/rentals/rent`, { filmId, customerId, staffId: 1 });

export const returnFilm = (rentalId: number) => axios.put(`${REST_API_BASE_URL}/rentals/return`, { rentalId });
