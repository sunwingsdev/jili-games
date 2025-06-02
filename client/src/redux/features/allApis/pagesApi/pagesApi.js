import baseApi from "../../baseApi";

const pagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPageDetails: builder.mutation({
      query: (data) => ({
        url: "/pages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pages"],
    }),

    getPagesDetail: builder.query({
      query: () => "/pages",
      providesTags: ["pages"],
    }),

    updatePageDetail: builder.mutation({
      query: ({ id, pageDetails }) => ({
        url: `/pages/${id}`,
        method: "PATCH",
        body: pageDetails,
      }),
      invalidatesTags: ["pages"],
    }),

    deletePageDetail: builder.mutation({
      query: (id) => ({
        url: `/pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pages"],
    }),
  }),
});

export const {
  useAddPageDetailsMutation,
  useGetPagesDetailQuery,
  useUpdatePageDetailMutation,
  useDeletePageDetailMutation,
} = pagesApi;
