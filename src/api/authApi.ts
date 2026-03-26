// authApi.ts

import { api } from "../features/apiSlice"



export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login/",
        method: "POST",
        body: data
      })
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-password/",
        method: "POST",
        body: data
      })
    })
  })
})

export const {
  useLoginMutation,
  useChangePasswordMutation
} = authApi