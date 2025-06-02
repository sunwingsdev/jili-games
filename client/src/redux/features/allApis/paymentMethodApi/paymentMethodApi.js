import baseApi from "../../baseApi";

const paymentMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPaymentMethod: builder.mutation({
      query: (data) => ({
        url: "/paymentmethod",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["paymentMethod"],
    }),

    getPaymentMethods: builder.query({
      query: () => "/paymentmethod",
      providesTags: ["paymentMethod"],
    }),

    getPaymentMethodById: builder.query({
      query: (id) => `/paymentmethod/${id}`,
      providesTags: ["paymentMethod"],
    }),

    updatePaymentMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `/paymentmethod/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["paymentMethod"],
    }),

    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/paymentmethod/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentMethod"],
    }),
  }),
});

export const {
  useAddPaymentMethodMutation,
  useGetPaymentMethodsQuery,
  useGetPaymentMethodByIdQuery,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodApi;
