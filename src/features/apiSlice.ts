import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./baseQueryApi";

export const api = createApi({
    reducerPath: "api",
    // baseQuery: fetchBaseQuery({
    //     baseUrl: `${url}/api/`,
    //     prepareHeaders: (headers, { getState }) => {
    //         const state = getState() as any

    //         console.log("AUTH STATE:", state.auth) // 👈 IMPORTANT

    //         const token = state?.auth?.token

    //         if (token) {
    //             headers.set("Authorization", `Bearer ${token}`)
    //         }

    //         return headers
    //     }
    // }),
    baseQuery: baseQueryWithAuth, 
    tagTypes: ["User", "Client", "Loan", "Payment", "Application","Users"],
    endpoints: () => ({}),
});