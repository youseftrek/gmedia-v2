// lib/apiClient.js
import axios from "axios";
import { signOut } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  // console.log("Making request to:", config.url);
  // console.log("Request config:", {
  //   method: config.method,
  //   headers: config.headers,
  //   data: config.data,
  // });

  // Safely check for sessionStorage
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // console.log("Response received:", {
    //   status: response.status,
    //   statusText: response.statusText,
    //   data: response.data,
    // });
    return response;
  },
  async (error) => {
    // console.error("API Error:", {
    //   message: error.message,
    //   status: error.response?.status,
    //   data: error.response?.data,
    // });

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Automatically logout user
      await signOut();
      window.location.href = process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URL || "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
