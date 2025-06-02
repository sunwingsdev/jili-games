import baseApi from "../../baseApi";

const affiliatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register as an agent
    addAffiliate: builder.mutation({
      query: (data) => ({
        url: "/users/affiliateregistration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    // Login as affiliate
    loginAffiliate: builder.mutation({
      query: (credentials) => ({
        url: "/users/affiliate/login",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["users"],
    }),

    // get all affiliates
    getAffiliates: builder.query({
      query: () => "/users/affiliates",
      providesTags: ["users"],
    }),

    // Update affiliate status
    updateAffiliateStatus: builder.mutation({
      query: ({ id, status, email, token }) => ({
        url: `/users/updateaffiliatestatus/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { status, email },
      }),
      invalidatesTags: ["users"],
    }),

    // get affiliate by id
    getAffiliateById: builder.query({
      query: (id) => `/users/single-affiliate/${id}`,
      providesTags: ["users"],
    }),

    // Update affiliate details
    updateAffiliate: builder.mutation({
      query: ({ id, data, token }) => {
        if (!id || !data || Object.keys(data).length === 0) {
          throw new Error("Affiliate ID or update data is missing");
        }
        return {
          url: `/users/update-affiliate/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        };
      },
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useAddAffiliateMutation,
  useLoginAffiliateMutation,
  useGetAffiliatesQuery,
  useUpdateAffiliateStatusMutation,
  useGetAffiliateByIdQuery,
  useUpdateAffiliateMutation,
} = affiliatesApi;
