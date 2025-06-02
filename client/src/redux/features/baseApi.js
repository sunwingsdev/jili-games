import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "users",
    "deposits",
    "withdraws",
    "uploads",
    "homeControls",
    "category",
    "subcategory",
    "homeGame",
    "kyc",
    "promotions",
    "promotion-category",
    "pages",
    "paymentNumber",
    "paymentMethod",
    "withdrawMethod",
    "refercodes",
    "commission",
  ],
  endpoints: () => ({}),
});

export const { useLoginMutation, useRegisterMutation, useFetchProfileQuery } =
  baseApi;
export default baseApi;
