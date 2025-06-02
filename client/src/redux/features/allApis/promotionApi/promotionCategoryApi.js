import baseApi from "../../baseApi";

const promotionCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPromotionCategory: builder.mutation({
      query: (data) => ({
        url: "/promotion-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["promotion-category"],
    }),

    getAllPromotionCategories: builder.query({
      query: () => "/promotion-categories",
      providesTags: ["promotion-category"],
    }),

    updatePromotionCategory: builder.mutation({
      query: (id) => ({
        url: `/promotion-categories/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["promotion-category"],
    }),

    deletePromotionCategory: builder.mutation({
      query: (id) => ({
        url: `/promotion-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["promotion-category"],
    }),
  }),
});

export const {
  useAddPromotionCategoryMutation,
  useGetAllPromotionCategoriesQuery,
  useUpdatePromotionCategoryMutation,
  useDeletePromotionCategoryMutation,
} = promotionCategoryApi;
