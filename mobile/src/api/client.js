import axios from "axios";
import { API_URL } from "../utils/constants";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
