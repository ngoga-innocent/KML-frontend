import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    token: string | null
    role: string | null
    must_change_password: boolean
}

// 🔥 Helpers
const getStoredToken = (): string | null =>
    localStorage.getItem("access") ||
    sessionStorage.getItem("access");

const getStoredRole = (): string | null =>
    localStorage.getItem("role") ||
    sessionStorage.getItem("role");

const getStoredMustChangePassword = (): boolean =>
    (localStorage.getItem("must_change_password") ||
        sessionStorage.getItem("must_change_password")) === "true";

// 🔥 Initial state
const initialState: AuthState = {
    token: getStoredToken(),
    role: getStoredRole(),
    must_change_password: getStoredMustChangePassword(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<any>) => {
            const { access, role, must_change_password, remember } = action.payload;

            console.log("dispatched setCredentials", role);

            state.token = access;
            state.role = role;
            state.must_change_password = must_change_password;

            const storage = remember ? localStorage : sessionStorage;

            // ✅ Persist everything needed
            storage.setItem("access", access);
            storage.setItem("role", role);
            storage.setItem("must_change_password", String(must_change_password));
        },

        logout: (state) => {
            state.token = null;
            state.role = null;
            state.must_change_password = false;

            // ✅ Clear BOTH storages
            localStorage.removeItem("access");
            localStorage.removeItem("role");
            localStorage.removeItem("must_change_password");

            sessionStorage.removeItem("access");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("must_change_password");
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;