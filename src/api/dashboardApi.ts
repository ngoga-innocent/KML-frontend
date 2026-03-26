import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuth,
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: (params) => {
                const hasParams = params && Object.keys(params).length > 0;

                return {
                    url: hasParams ? "/loans/dashboard/" : "/loans/dashboard/",
                    params: hasParams ? params : undefined,
                };
            },
        }),
    })

})
export const {
    useGetDashboardQuery
} = dashboardApi