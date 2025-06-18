import baseApi from "../../baseApi";

const userContactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a contact
    createContact: builder.mutation({
      query: (data) => ({
        url: "/user-contacts/create-contact",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userContact"],
    }),

    // Get all contacts
    getAllUserContacts: builder.query({
      query: () => "/user-contacts",
      providesTags: ["userContact"],
    }),

    // Get a single contact by ID
    getContactById: builder.query({
      query: (id) => `/user-contacts/${id}`,
      providesTags: ["userContact"],
    }),

    // Update a contact
    updateContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user-contacts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userContact"],
    }),

    // Delete a contact
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/user-contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userContact"],
    }),

    sendEmailOnUserContact: builder.mutation({
      query: (data) => ({
        url: "/user-contacts/send-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userContact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetAllUserContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useSendEmailOnUserContactMutation,
} = userContactsApi;
