import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const baseURL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl.replace(/\/+$/, "")}/api`;

export default axios.create({
    baseURL
});