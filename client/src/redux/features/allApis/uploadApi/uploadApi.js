import baseApi from "../../baseApi";

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // upload image

    uploadImage: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["uploads"],
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
