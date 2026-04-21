import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/apiSlice";
// import { authApi } from "../api/authApi";
import authReducer from "../features/authSlice"
import { loanTypeApi } from "../api/loanApi";
import { loanApplicationApi } from "../api/loanapplication";
import { paymentsApi } from "../api/paymentApi";
import { dashboardApi } from "../api/dashboardApi";
// import { userApi } from "../api/usersApi";
import uiReducer from "../features/uiSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        [api.reducerPath]: api.reducer,
        [loanTypeApi.reducerPath]: loanTypeApi.reducer,
        [loanApplicationApi.reducerPath]: loanApplicationApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        // [userApi.reducerPath]:userApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(loanTypeApi.middleware).concat(loanApplicationApi.middleware).concat(paymentsApi.middleware).concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;