import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/CommonPages/Login";
import Clients from "./pages/Admin/Client/Clients";
// import LoanManagementPage from "./pages/Admin/Loan";
import LoanTypeManagementPage from "./pages/Admin/LoanType";
import ApplyLoan from "./pages/Clients/ApplyLoan";
import LoanApplications from "./pages/Admin/LoanApplications";
import HomePage from "./pages/CommonPages/Home";
import ChangePassword from "./pages/CommonPages/ChangePassword";
import ProtectedRoute from "./app/Routes/ProtectedRoutes";
import Loans from "./pages/Admin/Loans/Loan";
import PaymentPage from "./pages/Clients/Payment";
import ErrorBoundary from "./components/ErrorBoundary";
import LoanApplicationPublic from "./pages/Clients/PublicApplication";
import PublicApplicationsDashboard from "./pages/Admin/PublicApplications";
import UsersPage from "./pages/Admin/Users/Users";
import Thanking from "./pages/CommonPages/Thanking";
import GlobalLoader from "./pages/CommonPages/Loader";
function App() {
  return (
    <>
      {" "}
      <GlobalLoader />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/thank-you" element={<Thanking />} />
            <Route path="/application" element={<LoanApplicationPublic />} />

            {/* PROTECTED */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            {/* ADMIN LAYOUT */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
              <Route
                path="apply-loan"
                element={
                  <ProtectedRoute>
                    <ApplyLoan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="loans"
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                }
              />
              <Route path="clients" element={<Clients />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="payments" element={<PaymentPage />} />

              <Route path="loan-types" element={<LoanTypeManagementPage />} />
              <Route path="loan-applications" element={<LoanApplications />} />
              <Route
                path="public-applications"
                element={<PublicApplicationsDashboard />}
              />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  );
}

export default App;
