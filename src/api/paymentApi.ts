import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

/* ================= TYPES ================= */

export interface LoanInfo {
  id: number;
  reference?: string;
  remaining_balance?: string;
}

export interface LoanPayment {
  id: number;
  loan: LoanInfo; // 👈 changed (was just number)
  amount_paid: string;
  payment_proof?: string;
  status: "pending" | "approved" | "rejected";
  payment_date: string;
  reference?: string;

  reviewed_by?: {
    id: number;
    name: string;
  };
}

/* ================= API ================= */

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Payments", "Loans"],

  endpoints: (builder) => ({
    /* ================= CREATE ================= */

    createPayment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/loans/loan-payments/",
        method: "POST",
        body: formData,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // you can trigger toast here if you want globally
        } catch {}
      },

      invalidatesTags: ["Payments", "Loans"],
    }),

    /* ================= LIST ================= */

    getPayments: builder.query<
      LoanPayment[],
      { status?: string } | void
    >({
      query: (params) => {
        if (!params) return "/loans/loan-payments/";
        return {
          url: "/loans/loan-payments/",
          params,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({
                type: "Payments" as const,
                id: p.id,
              })),
              { type: "Payments", id: "LIST" },
            ]
          : [{ type: "Payments", id: "LIST" }],
    }),

    /* ================= SINGLE ================= */

    getPaymentById: builder.query<LoanPayment, number>({
      query: (id) => `/loans/loan-payments/${id}/`,
      providesTags: (_, __, id) => [{ type: "Payments", id }],
    }),

    /* ================= REVIEW ================= */

    reviewPayment: builder.mutation<
      any,
      { id: number; action: "approve" | "reject" }
    >({
      query: ({ id, action }) => ({
        url: `/loans/loan-payments/${id}/review/`,
        method: "POST",
        body: { action },
      }),

      // 🔥 OPTIMISTIC UPDATE (SUPER IMPORTANT UX)
      async onQueryStarted(
        { id, action },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          paymentsApi.util.updateQueryData(
            "getPayments",
            undefined,
            (draft) => {
              const payment = draft.find((p) => p.id === id);
              if (payment) {
                payment.status =
                  action === "approve" ? "approved" : "rejected";
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // rollback if failed
        }
      },

    //   invalidatesTags: (result, error, { id }) => [
    //     { type: "Payments", id },
    //     { type: "Payments", id: "LIST" },
    //     { type: "Loans", id: "LIST" },
    //   ],
    }),

    /* ================= DELETE (OPTIONAL) ================= */

    deletePayment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/loans/loan-payments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

/* ================= EXPORT HOOKS ================= */

export const {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useReviewPaymentMutation,
  useDeletePaymentMutation,
} = paymentsApi;