import baseApi from "../../baseApi";

const homeGamesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addGame: builder.mutation({
      query: (data) => ({
        url: "/homegames",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["homeGame"],
    }),

    getAllHomeGames: builder.query({
      query: () => "/homegames",
      providesTags: ["homeGame"],
    }),

    updateHomeGame: builder.mutation({
      query: ({ id, data }) => ({
        url: `/homegames/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["homeGame"],
    }),

    deleteHomeGame: builder.mutation({
      query: (id) => ({
        url: `/homegames/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["homeGame"],
    }),
  }),
});
export const {
  useAddGameMutation,
  useGetAllHomeGamesQuery,
  useUpdateHomeGameMutation,
  useDeleteHomeGameMutation,
} = homeGamesApi;
