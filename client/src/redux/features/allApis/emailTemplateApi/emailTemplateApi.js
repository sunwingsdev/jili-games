import baseApi from "../../baseApi";

const emailTemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add a new email template
    addEmailTemplate: builder.mutation({
      query: (data) => ({
        url: "/email-templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["emailTemplate"],
    }),

    // Get all email templates
    getAllEmailTemplates: builder.query({
      query: () => "/email-templates",
      providesTags: ["emailTemplate"],
    }),

    // Get a single email template by ID
    getEmailTemplateById: builder.query({
      query: (id) => `/email-templates/${id}`,
      providesTags: ["emailTemplate"],
    }),

    // Update an email template
    updateEmailTemplate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/email-templates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["emailTemplate"],
    }),

    // Delete an email template
    deleteEmailTemplate: builder.mutation({
      query: (id) => ({
        url: `/email-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["emailTemplate"],
    }),
  }),
});

export const {
  useAddEmailTemplateMutation,
  useGetAllEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
} = emailTemplateApi;
