// sidebarConfig.ts
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Wallet,
} from "lucide-react";

export const SIDEBAR_CONFIG: any = {
  admin: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Loans",
      icon: CreditCard,
      children: [
        { to: "/dashboard/loans", label: "Loans" },
        { to: "/dashboard/loan-applications", label: "Applications" },
        { to: "/dashboard/loan-types", label: "Loan Types" },
        
      ],
    },

    {
      label: "Clients",
      icon: Users,
      children: [
        { to: "/dashboard/clients", label: "All Clients" },
      ],
    },

    {
      label: "Payments",
      to: "/dashboard/payments",
      icon: Wallet,
    },
  ],

  manager: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Loans",
      icon: CreditCard,
      children: [
        { to: "/dashboard/loans", label: "Loans" },
        { to: "/dashboard/loan-applications", label: "Applications" },
      ],
    },
    {
      label: "Clients",
      icon: Users,
      children: [
        { to: "/dashboard/clients", label: "Clients" },
      ],
    },
    {
      label: "Payments",
      to: "/dashboard/payments",
      icon: Wallet,
    },
  ],

  reviewer: [
    {
      label: "Applications",
      to: "/dashboard/loan-applications",
      icon: FileText,
    },
  ],

  client: [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Loans",
      icon: FileText,
      children: [
        { to: "/dashboard/loans", label: "Loans" },
        { to: "/dashboard/apply-loan", label: "Applications" },
        { to: "/dashboard/payments", label: "Payments" },
      ],
    },
  ],
};