import baseApi from "../../baseApi";

const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPackage: builder.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    getAllPackages: builder.query({
      query: () => "/packages",
      providesTags: ["package"],
    }),

    getPackageById: builder.query({
      query: (id) => `/packages/${id}`,
      providesTags: ["package"],
    }),

    updatePackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["package"],
    }),

    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["package"],
    }),
  }),
});
export const {
  useAddPackageMutation,
  useGetAllPackagesQuery,
  useGetPackageByIdQuery,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi;
