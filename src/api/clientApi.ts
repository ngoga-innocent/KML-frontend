import { api } from "../features/apiSlice"

export const clientApi = api.injectEndpoints({
    endpoints: (builder) => ({

        getClients: builder.query<any[], void>({
            query: () => "clients/",
            providesTags: ["Client"]
        }),

        createClient: builder.mutation({
            query: (data) => ({
                url: "clients/",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Client"]
        }),

        updateClient: builder.mutation({
            query: ({ id, data }) => ({
                url: `clients/${id}/`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Client"]
        }),

        deleteClient: builder.mutation({
            query: (id) => ({
                url: `clients/${id}/`,
                method: "DELETE"
            }),
            invalidatesTags: ["Client"]
        })

    })
})

export const {
    useGetClientsQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation
} = clientApi