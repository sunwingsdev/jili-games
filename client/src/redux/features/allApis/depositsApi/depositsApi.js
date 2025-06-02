import baseApi from "../../baseApi";

const depositsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add a deposit
    addDeposit: builder.mutation({
      query: (data) => ({
        url: "/deposits",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["deposits"],
    }),

    // get all deposits
    getDeposits: builder.query({
      query: () => "/deposits",
      providesTags: ["deposits"],
    }),

    // get deposits by userId
    getDepositsByUser: builder.query({
      query: (userId) => `/deposits/user/${userId}`,
      providesTags: ["deposits"],
    }),

    // update status
    updateDepositStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/deposits/status/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["deposits"],
    }),
  }),
});

export const {
  useAddDepositMutation,
  useGetDepositsQuery,
  useGetDepositsByUserQuery,
  useUpdateDepositStatusMutation,
} = depositsApi;
