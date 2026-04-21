// src/api/loanApplicationApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../features/baseQueryApi";

export interface LoanApplication {
  id: number;
  loan_type: number;
  loan_type_details:any;
  requested_amount: string;
  status: string;
  contract?: string;
  signed_contract?: string;
  is_signed: boolean;
  created_at: string;
  comment?:string
  client_data?:any
}

export const loanApplicationApi = createApi({
  reducerPath: "loanApplicationApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["LoanApplication","PublicApplications"],

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
    createPublicApplication: builder.mutation({
      query: (data) => ({
        url: "/loans/public-applications/",
        method: "POST",
        body: data,
      }),
    }),

    // =========================
    // 🔐 GET ALL APPLICATIONS (Admin/Manager/Reviewer)
    // =========================
    getPublicApplications: builder.query<any,void>({
      query: () => "/loans/admin/public-applications/",
      providesTags: ["PublicApplications"],
    }),

    // =========================
    // 🔐 GET SINGLE APPLICATION
    // =========================
    getPublicApplication: builder.query({
      query: (id) => `/loans/admin/public-applications/${id}/`,
    }),

    // =========================
    // 🔐 UPDATE APPLICATION
    // =========================
    updatePublicApplication: builder.mutation({
      query: ({ id, data }) => ({
        url: `/loans/admin/public-applications/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PublicApplications"],
    }),

    // =========================
    // 🔐 REVIEW
    // =========================
    reviewPublicApplication: builder.mutation({
      query: (id) => ({
        url: `/loans/admin/public-applications/${id}/review/`,
        method: "POST",
      }),
      invalidatesTags: ["PublicApplications"],
    }),

    // =========================
    // 🔐 CONVERT
    // =========================
    convertPublicApplication: builder.mutation({
      query: ({id,body}) => ({
        url: `/loans/admin/public-applications/${id}/convert/`,
        method: "POST",
        body
      }),
      invalidatesTags: ["PublicApplications"],
    }),

    // =========================
    // 🔐 REJECT
    // =========================
    rejectPublicApplication: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/loans/admin/public-applications/${id}/reject/`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["PublicApplications"],
    }),
    // =========================
    //ADMIM CREATE LOAN APPLICATION
    //===========================
    createAdminApplication: builder.mutation({
      query: (data) => ({
        url: "/loans/admin-loan-applications/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LoanApplication"],
    }),
  })
});

export const {
  useGetApplicationsQuery,
  useApplyLoanMutation,
  useReviewApplicationMutation,
  useUploadContractMutation,
  useSignContractMutation,
  useUploadSignedContractMutation,
  useFinalizeLoanMutation,
  useCreatePublicApplicationMutation,
  useGetPublicApplicationsQuery,
  useGetPublicApplicationQuery,
  useUpdatePublicApplicationMutation,
  useReviewPublicApplicationMutation,
  useConvertPublicApplicationMutation,
  useRejectPublicApplicationMutation,
  useCreateAdminApplicationMutation
} = loanApplicationApi;