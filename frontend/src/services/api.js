import axios from "axios";

//links to the backend URL
const API = axios.create({
    baseURL: "http://localhost:5000/api"
})

//attach token from the backend
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});



export const register = (data) => API.post("/users/register", data);
export const login = (data) => API.post("/users/login", data);
export const addAccount = (id, data) => API.post(`/users/accounts/${id}`, data);
export const getUser = () => API.get("/users/getUser");
export const deleteUser = (id) => API.delete(`/users/delete-user/${id}`);
export const fetchTransactions = (filters = {}) => API.get("/transactions/transactions-list", { params: filters });
export const addTransaction = () => API.post("/transactions/transaction-add");
export const removeTransaction = (id) => API.delete(`/transactions/removeTransaction/${id}`);  