import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/apiSlice";
// import { authApi } from "../api/authApi";
import authReducer from "../features/authSlice"
import { loanTypeApi } from "../api/loanApi";
import { loanApplicationApi } from "../api/loanapplication";
import { paymentsApi } from "../api/paymentApi";
import { dashboardApi } from "../api/dashboardApi";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer,
        [loanTypeApi.reducerPath]: loanTypeApi.reducer,
        [loanApplicationApi.reducerPath]:loanApplicationApi.reducer,
        [paymentsApi.reducerPath]:paymentsApi.reducer,
        [dashboardApi.reducerPath]:dashboardApi.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(loanTypeApi.middleware).concat(loanApplicationApi.middleware).concat(paymentsApi.middleware).concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;