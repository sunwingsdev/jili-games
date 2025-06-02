import baseApi from "../../baseApi";

const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add a kyc
    addKyc: builder.mutation({
      query: (data) => ({
        url: "/kyc",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["kyc"],
    }),

    // get all kycs
    getAllKycs: builder.query({
      query: () => "/kyc",
      providesTags: ["kyc"],
    }),

    // get kyc by id
    getKycById: builder.query({
      query: (id) => `/kyc/single-kyc/${id}`,
      providesTags: ["kyc"],
    }),

    updateKycStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/kyc/update-kyc-status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["kyc"],
    }),
  }),
});

export const {
  useAddKycMutation,
  useGetAllKycsQuery,
  useGetKycByIdQuery,
  useUpdateKycStatusMutation,
} = kycApi;
