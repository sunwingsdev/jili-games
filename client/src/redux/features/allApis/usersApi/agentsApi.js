import baseApi from "../../baseApi";

const agentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register as an agent
    addAgent: builder.mutation({
      query: (data) => ({
        url: "/users/agentregistration",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    // Login an agent
    loginAgent: builder.mutation({
      query: (credentials) => ({
        url: "/users/agent/login",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["users"],
    }),

    // get all agents
    getAgents: builder.query({
      query: () => "/users/agent",
      providesTags: ["users"],
    }),

    getAgentById: builder.query({
      query: (id) => `/users/single-agent/${id}`,
      providesTags: ["users"],
    }),

    // Update agent status
    updateAgentStatus: builder.mutation({
      query: ({ id, status, email, token }) => ({
        url: `/users/updateagentstatus/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { status, email },
      }),
      invalidatesTags: ["users"],
    }),

    // Update agent details
    updateAgent: builder.mutation({
      query: ({ id, data, token }) => {
        if (!id || !data || Object.keys(data).length === 0) {
          throw new Error("Agent ID or update data is missing"); // Validate before query
        }
        return {
          url: `/users/update-agent/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        };
      },
      invalidatesTags: ["users"], // Update cache for user-related data
    }),

    // ✅ Login as Agent (Admin logs in as an agent)
    loginAsAgent: builder.mutation({
      query: (username) => ({
        url: "/users/admin/login-as-agent",
        method: "POST",
        body: { username },
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useAddAgentMutation,
  useLoginAgentMutation,
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  useLazyGetAgentByIdQuery,
  useUpdateAgentStatusMutation,
  useUpdateAgentMutation,
  useLoginAsAgentMutation,
} = agentsApi;
