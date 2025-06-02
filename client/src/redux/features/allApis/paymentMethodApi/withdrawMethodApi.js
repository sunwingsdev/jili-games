import baseApi from "../../baseApi";

const withdrawMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addWithdrawMethod: builder.mutation({
      query: (data) => ({
        url: "/withdrawmethod",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["withdrawMethod"],
    }),

    getWithdrawMethods: builder.query({
      query: () => "/withdrawmethod",
      providesTags: ["withdrawMethod"],
    }),

    getWithdrawMethodById: builder.query({
      query: (id) => `/withdrawmethod/${id}`,
      providesTags: ["withdrawMethod"],
    }),

    updateWithdrawMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `/withdrawmethod/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["withdrawMethod"],
    }),

    deleteWithdrawMethod: builder.mutation({
      query: (id) => ({
        url: `/withdrawmethod/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["withdrawMethod"],
    }),
  }),
});

export const {
  useAddWithdrawMethodMutation,
  useGetWithdrawMethodsQuery,
  useGetWithdrawMethodByIdQuery,
  useUpdateWithdrawMethodMutation,
  useDeleteWithdrawMethodMutation,
} = withdrawMethodApi;
