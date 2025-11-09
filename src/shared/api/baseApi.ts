import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fakestoreapi.com", // FakeStore API base URL
    prepareHeaders: (headers, { getState: _getState }) => {
      // Add auth token or other headers here when needed
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers
    },
  }),
  tagTypes: ["Product", "Category", "User"], // Define tag types for cache invalidation
  endpoints: () => ({}), // Base API has no endpoints - they'll be injected by feature modules
})

// Export the base API for extending in feature modules
export default baseApi
