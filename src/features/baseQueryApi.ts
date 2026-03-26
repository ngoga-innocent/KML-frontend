// src/api/baseQuery.ts

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import { logout } from "./authSlice"
import { url } from "../url"


const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${url}/api/`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    return headers
  }
})

export const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  // 🔥 GLOBAL ERROR HANDLING
  if (result.error) {
    const status = result.error.status

    if (status === 401) {
      localStorage.removeItem("access")
      sessionStorage.removeItem("access")
      toast.error("You are not authorized. Please login again.")

      // optional: force logout
      api.dispatch(logout())

      // optional: redirect
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
    }

    if (status === 403) {
      toast.error("You don't have permission to perform this action.")
    }

    if (status === 500) {
      toast.error("Server error. Please try again later.")
    }
  }

  return result
}