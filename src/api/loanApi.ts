import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";


export interface LoanType {
  id: number;
  name: string;
  description: string;
  min_amount: string;
  max_amount: string;
  interest_rate: string;
  interest_type: string;
  repayment_period_value: number;
  repayment_period_unit: string;
  repayment_frequency: string;
  processing_fee_percentage: string;
  late_payment_penalty_percentage: string;
  grace_period_days: number;
  requires_collateral: boolean;
  collateral_description: string;
  is_active: boolean;
}

export const loanTypeApi = createApi({
  reducerPath: "loanTypeApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["LoanType", "Loans"],

  endpoints: (builder) => ({
    // GET ALL
    getLoanTypes: builder.query<LoanType[], void>({
      query: () => "/loans/loan-types/",
      providesTags: ["LoanType"],
    }),

    // CREATE
    createLoanType: builder.mutation({
      query: (data) => ({
        url: "/loans/loan-types/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LoanType"],
    }),

    // UPDATE
    updateLoanType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/loans/loan-types/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LoanType"],
    }),

    // DELETE
    deleteLoanType: builder.mutation({
      query: (id) => ({
        url: `/loans/loan-types/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LoanType"],
    }),
    /* ============= LOAN API ======== */
    getLoans: builder.query<any, void>({
      query: () => "/loans/list",
      providesTags: ["Loans"],
    }),
    //Create Loan Admin
    createLoan: builder.mutation({
    query: (data) => ({
      url: "/loans/loans/create-manual/",
      method: "POST",
      body: data,
    }),
  }),

  }),
  
  
});

export const {
  useGetLoanTypesQuery,
  useCreateLoanTypeMutation,
  useUpdateLoanTypeMutation,
  useDeleteLoanTypeMutation,
  useGetLoansQuery,
  useCreateLoanMutation,
} = loanTypeApi;