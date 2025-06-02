import baseApi from "../../baseApi";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register a user
    addUser: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    // Login a user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["users"],
    }),

    // Fetch authenticated user
    getAuthenticatedUser: builder.query({
      query: (token) => ({
        url: "/users/profile",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["users"],
    }),

    // get all users
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["users"],
    }),

    getUserById: builder.query({
      query: (id) => `/users/single-user/${id}`,
      providesTags: ["users"],
    }),

    // Update user status (e.g., approve, reject, ban)
    updateUserStatus: builder.mutation({
      query: ({ id, status, email, token }) => ({
        url: `/users/updateuserstatus/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { status, email },
      }),
      invalidatesTags: ["users"],
    }),

    // Update user details
    updateUser: builder.mutation({
      query: ({ id, data, token }) => {
        if (!id || !data || Object.keys(data).length === 0) {
          throw new Error("User ID or update data is missing"); // Validate before query
        }
        return {
          url: `/users/update-user/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        };
      },
      invalidatesTags: ["users"], // Update cache for user-related data
    }),

    // Update user profile image
    updateUserProfileImage: builder.mutation({
      query: ({ id, profileImage, token }) => ({
        url: `/users/update-user-image/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { profileImage },
      }),
      invalidatesTags: ["users"],
    }),

    addUserBalance: builder.mutation({
      query: ({ id, amountToAdd, token }) => ({
        url: `/users/add-balance/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: { amountToAdd },
      }),
      invalidatesTags: ["users"],
    }),

    subtractUserBalance: builder.mutation({
      query: ({ id, amountToSubtract, token }) => ({
        url: `/users/subtract-balance/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: { amountToSubtract },
      }),
      invalidatesTags: ["users"],
    }),

    getAllUsersBalanceHistory: builder.query({
      query: (token) => ({
        url: "/users/balance-history",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useLoginUserMutation,
  useLazyGetAuthenticatedUserQuery,
  useGetUsersQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
  useUpdateUserProfileImageMutation,
  useAddUserBalanceMutation,
  useSubtractUserBalanceMutation,
  useGetAllUsersBalanceHistoryQuery,
} = usersApi;
