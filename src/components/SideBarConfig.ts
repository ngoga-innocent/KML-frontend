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
        { to: "/dashboard/loans", label: "Loans",key:"loans" },
        { to: "/dashboard/loan-applications", label: "Applications",key:"loan-applications" },
        { to: "/dashboard/public-applications", label: "Public Applications",key:"public-applications" },
        { to: "/dashboard/loan-types", label: "Loan Types",key:"loan-types" },
        
        
      ],

    },
     

    {
      label: "Users",
      icon: Users,
      to: "/dashboard/users",
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
        { to: "/dashboard/public-applications", label: "Public Applications" },
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
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Applications",
      
      Children:[
        { to: "/dashboard/loan-applications", label: "Applications" },
        { to: "/dashboard/public-applications", label: "Public Applications" },
      ],
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
export const enrichSidebarWithCounts = (items: any[], counts: any) => {
  return items.map((item) => {
    if (item.children) {
      return {
        ...item,
        children: item.children.map((child: any) => ({
          ...child,
          count: counts[child.key] || 0,
        })),
      };
    }

    return item;
  });
};