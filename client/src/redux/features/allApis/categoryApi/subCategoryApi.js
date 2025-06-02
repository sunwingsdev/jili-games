import baseApi from "../../baseApi";

const subCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Sub-Category
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: "/sub-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subcategory"],
    }),

    // Get All Sub-Categories
    getAllSubCategories: builder.query({
      query: () => "/sub-categories",
      providesTags: ["subcategory"],
    }),

    // Update Sub-Category
    updateSubCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sub-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subcategory"],
    }),

    // Delete Sub-Category
    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/sub-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subcategory"],
    }),
  }),
});
export const {
  useAddSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
