import baseApi from "../../baseApi";

const commissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add a commission
    addCommission: builder.mutation({
      query: (data) => ({
        url: "/commissions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["commission"],
    }),

    // Update a commission
    updateCommission: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/commissions/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["commission"],
    }),

    // get all commission
    getAllCommissions: builder.query({
      query: () => "/commissions",
      providesTags: ["commission"],
    }),
  }),
});

export const {
  useAddCommissionMutation,
  useUpdateCommissionMutation,
  useGetAllCommissionsQuery,
} = commissionApi;
