import baseApi from "../../baseApi";

const paymentNumberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add a payment number
    addPaymentNumber: builder.mutation({
      query: (data) => ({
        url: "/paymentnumber",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["paymentNumber"],
    }),

    // get all payment numbers
    getAllPaymentNumbers: builder.query({
      query: () => "/paymentnumber",
      providesTags: ["paymentNumber"],
    }),

    // get payment number by id
    getPaymentNumberById: builder.query({
      query: (id) => `/paymentnumber/single-number/${id}`,
      providesTags: ["paymentNumber"],
    }),

    // update payment number status
    updatePaymentNumberStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/paymentnumber/update-number-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["paymentNumber"],
    }),

    // get a random number
    getRandomNumber: builder.query({
      query: (method) => `/paymentnumber/random-number/${method}`,
      providesTags: ["paymentNumber"],
    }),
  }),
});

export const {
  useAddPaymentNumberMutation,
  useGetAllPaymentNumbersQuery,
  useGetPaymentNumberByIdQuery,
  useUpdatePaymentNumberStatusMutation,
  useGetRandomNumberQuery,
} = paymentNumberApi;
