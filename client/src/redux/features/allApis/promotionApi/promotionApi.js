import baseApi from "../../baseApi";

const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPromotion: builder.mutation({
      query: (data) => ({
        url: "/promotions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["promotions"],
    }),

    getPromotions: builder.query({
      query: () => "/promotions",
      providesTags: ["promotions"],
    }),

    updatePromotion: builder.mutation({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["promotions"],
    }),

    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["promotions"],
    }),
  }),
});

export const {
  useAddPromotionMutation,
  useGetPromotionsQuery,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
