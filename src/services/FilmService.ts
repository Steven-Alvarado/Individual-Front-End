import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/films';

export const listFilms = () => axios.get(REST_API_BASE_URL);

export const listTop5Films = () => axios.get(`${REST_API_BASE_URL}/top5`);