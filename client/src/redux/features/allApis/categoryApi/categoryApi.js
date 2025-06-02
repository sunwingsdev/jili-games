import baseApi from "../../baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Category
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    // Get All Categories
    getAllCategories: builder.query({
      query: () => "/categories",
      providesTags: ["category"],
    }),

    // Update Category by ID
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    // Delete Category by ID
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["category", "subcategory", "homeGame"],
    }),
  }),
});
export const {
  useAddCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
