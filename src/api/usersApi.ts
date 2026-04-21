import { api } from "../features/apiSlice";

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<any[], void>({
            query: () => "/users/users/",
            providesTags: ["Users"],  // 🔥 provides cache tag
        }),

        createUser: builder.mutation({
            query: (data) => ({
                url: "/users/users/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],  // 🔥 triggers refetch
        }),

        updateUser: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/users/${id}/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Users"],  // 🔥 triggers refetch
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/users/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],  // 🔥 triggers refetch
        }),
    }),
});
export const {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi;