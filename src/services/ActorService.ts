import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/api/actors';

export const listTop5Actors = () => axios.get(`${REST_API_BASE_URL}/top5`);


