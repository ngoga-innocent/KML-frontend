// src/api/loanApplicationApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

export interface LoanApplication {
  id: number;
  loan_type: number;
  loan_type_details: {
    name: string;
  };
  requested_amount: string;
  status: string;
  contract?: string;
  is_signed: boolean;
  created_at: string;
  comment?:string
  client_data?:any
}

export const loanApplicationApi = createApi({
  reducerPath: "loanApplicationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["LoanApplication"],

  endpoints: (builder) => ({
    // GET
    getApplications: builder.query<LoanApplication[], void>({
      query: () => "/loans/loan-applications/",
      providesTags: ["LoanApplication"],
    }),

    // APPLY
    applyLoan: builder.mutation({
      query: (data) => ({
        url: "/loans/loan-applications/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LoanApplication"],
    }),

    // ADMIN REVIEW
    reviewApplication: builder.mutation({
      query: ({ id, decision, comment }) => ({
        url: `/loans/loan-applications/${id}/review/`,
        method: "POST",
        body: { decision, comment },
      }),
      invalidatesTags: ["LoanApplication"],
    }),

    // UPLOAD CONTRACT
    uploadContract: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("contract", file);

        return {
          url: `/loans/loan-applications/${id}/upload_contract/`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["LoanApplication"],
    }),

    // SIGN
    signContract: builder.mutation({
      query: ({id,data}) => ({
        url: `/loans/loan-applications/${id}/sign/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ["LoanApplication"],
    }),
    uploadSignedContract: builder.mutation<void,any>({
      query: ({id,data}) => ({
        url: `/loans/loan-applications/${id}/sign/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ["LoanApplication"],
    }),

    // FINALIZE
    finalizeLoan: builder.mutation({
      query: (id) => ({
        url: `/loans/loan-applications/${id}/finalize/`,
        method: "POST",
      }),
      invalidatesTags: ["LoanApplication"],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useApplyLoanMutation,
  useReviewApplicationMutation,
  useUploadContractMutation,
  useSignContractMutation,
  useUploadSignedContractMutation,
  useFinalizeLoanMutation,
} = loanApplicationApi;