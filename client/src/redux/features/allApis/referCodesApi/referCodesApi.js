import baseApi from "../../baseApi";

const referCodesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // add a refer link
    addReferCode: builder.mutation({
      query: (data) => ({
        url: "/refer-links/generate-referral",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["refercodes"],
    }),

    // get all refer link
    getAllReferCodes: builder.query({
      query: () => "/refer-links",
      providesTags: ["refercodes"],
    }),
  }),
});

export const { useAddReferCodeMutation, useGetAllReferCodesQuery } =
  referCodesApi;
