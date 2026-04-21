import { useState } from "react";
import React from "react";
import { useCreatePublicApplicationMutation } from "../../api/loanapplication";
import { toast } from "react-toastify";
import { useGetLoanTypesQuery } from "../../api/loanApi";

// =========================
// 🔹 REUSABLE COMPONENTS
// =========================
const Input = React.memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    disabled,
    required = true,
  }: any) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        // className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-secondary outline-none"
        disabled={disabled}
        className={`w-full mt-1 p-3 border rounded-lg ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } focus:ring-2 focus:ring-secondary outline-none`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  ),
);

const Select = React.memo(
  ({ label, name, value, onChange, options, error }: any) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-secondary"
      >
        <option value="">Select {label}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  ),
);

// =========================
// 🔹 MAIN COMPONENT
// =========================
export default function LoanApplicationModern() {
  const [form, setForm] = useState<any>({
    full_name: "",
    phone: "",
    email: "",
    national_id: "",
    gender: "",
    marital_status: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    employer: "",
    position: "",
    supervisor: "",
    employer_phone: "",
    salary: "",
    loan_type: "",
    requested_amount: "",
    loan_words: "",
    application_date: "",
    signature: "",
  });

  const [files, setFiles] = useState<any>({
    id_document: null,
    job_contract: null,
    bank_statement: null,
  });
  const {
    data: loanTypes,
    isFetching,
    isLoading: loan_typeLoading,
  } = useGetLoanTypesQuery();
  console.log(loanTypes, loan_typeLoading, isFetching);
  const [errors, setErrors] = useState<any>({});
  const [createPublicApplication, { isLoading }] =
    useCreatePublicApplicationMutation();

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: "",
    }));
  };
  // Selected Loan Type
  const selectedLoanType = loanTypes?.find(
    (lt: any) => lt.id == form.loan_type,
  );

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    let newErrors: any = {};

    if (!form.full_name) newErrors.full_name = "Full name is required";
    if (!form.phone) newErrors.phone = "Phone is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.national_id) newErrors.national_id = "National ID required";
    if (!form.gender) newErrors.gender = "Select gender";
    if (!form.marital_status)
      newErrors.marital_status = "Select marital status";

    if (!form.requested_amount) newErrors.loan_amount = "Loan amount required";
    else if (Number(form.requested_amount) <= 0)
      newErrors.loan_amount = "Invalid amount";

    if (!form.signature) newErrors.signature = "Signature required";
    if (!form.loan_type) newErrors.loan_type = "Select loan type";
    if (!files.id_document) newErrors.id_document = "ID document required";
    if (!files.job_contract) newErrors.job_contract = "Job contract required";
    if (!files.bank_statement)
      newErrors.bank_statement = "Bank statement required";
    if (!form.requested_amount) {
      newErrors.loan_amount = "Loan amount required";
    } else {
      const amount = Number(form.requested_amount);

      if (amount <= 0) {
        newErrors.loan_amount = "Invalid amount";
      }

      if (selectedLoanType) {
        if (amount > Number(selectedLoanType.max_amount)) {
          newErrors.loan_amount = `Maximum allowed is ${selectedLoanType.max_amount} RWF`;
        }

        if (
          selectedLoanType.min_amount &&
          amount < Number(selectedLoanType.min_amount)
        ) {
          newErrors.loan_amount = `Minimum allowed is ${selectedLoanType.min_amount} RWF`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (files.id_document) formData.append("id_document", files.id_document);
      if (files.job_contract)
        formData.append("job_contract", files.job_contract);
      if (files.bank_statement)
        formData.append("bank_statement", files.bank_statement);

      await createPublicApplication(formData).unwrap();

      toast.success("Application submitted successfully!");

      // reset
      setForm({
        full_name: "",
        phone: "",
        email: "",
        national_id: "",
        gender: "",
        marital_status: "",
        district: "",
        sector: "",
        cell: "",
        village: "",
        employer: "",
        position: "",
        supervisor: "",
        employer_phone: "",
        salary: "",
        requested_amount: "",
        loan_words: "",
        application_date: "",
        signature: "",
      });

      setFiles({
        id_document: null,
        job_contract: null,
        bank_statement: null,
      });
      window.location.href = "/thank-you";
      // setTimeout(() => window.location.reload(), 3000);
    } catch (err: any) {
      console.log(err);
      toast.error(
        err?.data?.detail ||
          err?.data?.non_field_errors[0] ||
          "Submission failed",
      );
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen flex bg-linear-to-br from-primary via-[#0f2a52] to-secondary">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white">
        <div className="flex flex-col gap-y-40">
          <div>
            <a
              href="/"
              className="bg-white text-primary font-bold px-3 py-1 rounded w-fit"
            >
              KML
            </a>
            <p className="mt-4 text-sm text-gray-300">
              Quick and secure loan application
            </p>
          </div>
          <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none">
            <svg viewBox="0 0 500 300" className="w-full h-[60vh]">
              <path
                d="M0,200 C150,100 350,300 500,200"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 inset-0 opacity-20 animate-pulse pointer-events-none">
            <svg viewBox="0 0 200 300" className="w-full h-[60vh]">
              <path
                d="M0,200 C150,100 350,300 500,200"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className="my-20">
            <div className="absolute inset-0 opacity-20 animate-pulse pointer-events-none">
              <svg viewBox="0 0 500 300" className="w-full h-[60vh]">
                <path
                  d="M0,200 C150,100 350,500 500,200"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 inset-0 opacity-20 animate-pulse pointer-events-none">
              <svg viewBox="0 0 200 300" className="w-full h-[60vh]">
                <path
                  d="M0,200 C150,100 350,300 500,200"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Apply for a loan <br /> in minutes
            </h2>
            <p className="text-gray-400 mt-2">
              Fast, secure and simple process.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Kigali Microloans
        </p>
      </div>

      {/* FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary">
              Loan Application
            </h2>
            <p className="text-sm text-gray-500">Fill your details carefully</p>
          </div>
          {/* Applicant */}
          <div>
            <h3 className="font-semibold text-primary mb-3">
              Applicant Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                required
                onChange={handleChange}
                error={errors.full_name}
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="National ID"
                name="national_id"
                value={form.national_id}
                onChange={handleChange}
                error={errors.national_id}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                error={errors.gender}
              />

              <Select
                label="Marital Status"
                name="marital_status"
                value={form.marital_status}
                onChange={handleChange}
                options={[
                  { label: "Single", value: "single" },
                  { label: "Married", value: "married" },
                  { label: "Divorced", value: "divorced" },
                ]}
                error={errors.marital_status}
              />
            </div>
          </div>
          {/* Location */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {" "}
            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
            />{" "}
            <Input
              label="Sector"
              name="sector"
              value={form.sector}
              onChange={handleChange}
            />{" "}
            <Input
              label="Cell"
              name="cell"
              value={form.cell}
              onChange={handleChange}
            />{" "}
          </div>{" "}
          <div className="mt-4">
            {" "}
            <Input
              label="Village"
              name="village"
              value={form.village}
              onChange={handleChange}
            />{" "}
          </div>
          {/* Employment */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Employment</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Company"
                name="employer"
                value={form.employer}
                onChange={handleChange}
              />
              <Input
                label="Position"
                name="position"
                value={form.position}
                onChange={handleChange}
              />
              <Input
                label="Supervisor"
                name="supervisor"
                value={form.supervisor}
                onChange={handleChange}
              />
              <Input
                label="Employer Phone"
                name="employer_phone"
                value={form.employer_phone}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Monthly Salary (RWF)"
                name="salary"
                type="number"
                value={form.salary}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Loan */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Loan Details</h3>
            {loanTypes && loanTypes?.length > 0 && (
              <Select
                label="Loan Type"
                name="loan_type"
                value={form.loan_type}
                onChange={handleChange}
                options={loanTypes?.map((lt: any) => ({
                  label: `${lt.name} (range: ${lt.min_amount || 0} - ${lt.max_amount} RWF)`,
                  value: lt.id,
                }))}
                error={errors.loan_type}
              />
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Loan Amount"
                name="requested_amount"
                type="number"
                required
                value={form.requested_amount}
                onChange={handleChange}
                error={errors.loan_amount}
                disabled={!form.loan_type}
              />
              <Input
                label="Amount in Words"
                name="loan_words"
                value={form.loan_words}
                onChange={handleChange}
                disabled={!form.loan_type}
                error={errors.loan_amount}
              />
            </div>
          </div>
          {/* Documents */}
          <div>
            <h3 className="font-semibold text-primary mb-3">
              Supporting Documents
            </h3>

            <div className="space-y-4 text-sm">
              {["id_document", "job_contract", "bank_statement"].map(
                (key: any) => (
                  <div key={key}>
                    <label className="block font-medium capitalize">
                      {key.replace("_", " ")}
                    </label>
                    <input
                      type="file"
                      required
                      className="mt-1 border border-gray-300 rounded-md p-2 w-full"
                      onChange={(e) =>
                        setFiles({
                          ...files,
                          [key]: e.target.files?.[0],
                        })
                      }
                    />
                    {errors[key] && (
                      <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                    )}
                    {files[key] && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {files[key].name}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
          {/* Declaration */}
          <div>
            <h3 className="font-semibold text-primary mb-3">Declaration</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Date"
                name="application_date"
                type="date"
                value={form.application_date}
                onChange={handleChange}
              />
              <Input
                label="Signature"
                name="signature"
                value={form.signature}
                onChange={handleChange}
                error={errors.signature}
              />
            </div>
          </div>
          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-secondary text-white p-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </button>
          <p className="text-xs text-center text-gray-500">
            🔒 Secure • Kigali Microloans
          </p>
        </div>
      </div>
    </div>
  );
}
