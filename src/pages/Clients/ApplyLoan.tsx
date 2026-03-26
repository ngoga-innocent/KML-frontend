import React, { useState, useRef, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Draggable from "react-draggable";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PDFDocument, rgb } from "pdf-lib";
import { useGetLoanTypesQuery } from "../../api/loanApi";
import {
  useApplyLoanMutation,
  useGetApplicationsQuery,
  useSignContractMutation,
} from "../../api/loanapplication";
import { url } from "../../url";
import { CheckCircle, Signature, X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function ApplyLoan() {
  const { data: loanTypes = [] } = useGetLoanTypesQuery();
  const { data: applications = [] } = useGetApplicationsQuery();

  const [applyLoan, { isLoading }] = useApplyLoanMutation();
  const [signContract, { isLoading: signContractLoading }] =
    useSignContractMutation();
  const [manualDrawer, setManualDrawer] = useState(false);
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedLoanType, setSelectedLoanType] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const [elements, setElements] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const sigRef = useRef<any>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  const elementRefs = useRef<{ [key: number]: any }>({});
  const idCounter = useRef(1);

  const BASE_URL = url;
  const getFileUrl = (path: string) =>
    path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  /* ================= APPLY ================= */
  const handleApply = async () => {
    if (!loanType || !amount) return toast.error("Fill all fields");

    try {
      await applyLoan({
        loan_type: loanType,
        requested_amount: amount,
      }).unwrap();
      toast.success("Application submitted");
    } catch (err: any) {
      console.log(err.data[0]);
      if (err?.data?.non_field_errors) {
        toast.error(
          err?.data?.non_field_errors[0] || err?.data[0] || err?.data,
        );
      } else if(err?.data) {
        toast.error(err?.data[0]);
        
      }else{
        toast.error("Failed to apply for Loan");
      }
    }
  };

  /* ================= MODAL ================= */
  const openModal = (app: any) => {
    setSelectedApp(app);
    setModalOpen(true);
    setElements([]);
    setClientName("");
    elementRefs.current = {};
    idCounter.current = 1;
  };

  /* ================= ADD ELEMENT ================= */
  const addElement = (type: "signature" | "name", value: string) => {
    const id = idCounter.current++;
    elementRefs.current[id] = React.createRef();

    setElements((prev) => [
      ...prev,
      { id, type, value, x: 50, y: 50, page: currentPage },
    ]);

    toast.success(
      `${type} added on page ${currentPage} please drag it to appropriate place on Document`,
    );
  };

  const addName = () => {
    if (!clientName) return toast.error("Enter name");
    addElement("name", clientName);
  };

  const saveSignature = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      return toast.error("Draw signature first");
    }
    addElement("signature", sigRef.current.toDataURL());
  };

  /* ================= DRAG ================= */
  const updatePosition = (id: number, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el)),
    );
  };

  /* ================= PAGE DETECTION ================= */
  useEffect(() => {
    const container = pdfWrapperRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pages = container.querySelectorAll(".pdf-page");

      pages.forEach((page: any, index) => {
        const rect = page.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          setCurrentPage(index + 1);
        }
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= GENERATE SIGNED PDF ================= */
  const generateSignedPdf = async (pdfUrl: string, elements: any[]) => {
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer(),
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    const RENDER_WIDTH = 600; // 🔥 match your Page width

    for (const el of elements) {
      if (el.page > pages.length) continue;

      const page = pages[el.page - 1];

      const pdfWidth = page.getWidth();
      const pdfHeight = page.getHeight();

      // ✅ single consistent scale
      const scale = pdfWidth / RENDER_WIDTH;

      const x = el.x * scale;

      const y =
        pdfHeight -
        el.y * scale -
        (el.type === "signature" ? 50 * scale : 14 * scale);

      if (el.type === "name") {
        page.drawText(el.value, {
          x,
          y,
          size: 14 * scale,
          color: rgb(0, 0, 0),
        });
      }

      if (el.type === "signature") {
        const imgBytes = await fetch(el.value).then((res) => res.arrayBuffer());
        let img;

        if (el.value.startsWith("data:image/png")) {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }

        page.drawImage(img, {
          x,
          y,
          width: 120 * scale,
          height: 50 * scale,
        });
      }
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: "application/pdf" });
  };

  /* ================= SIGN ================= */
  // const handleSign = async () => {
  //   if (!elements.length) return toast.error("Add signature or name");

  //   try {
  //     const signedBlob = await generateSignedPdf(
  //       getFileUrl(selectedApp.contract),
  //       elements
  //     );

  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to sign contract");
  //   }
  // };
  if(signContractLoading){
    toast.info('Signing Contract')
  }
  const handleSign = async () => {
    if (!elements.length) return toast.error("Add signature or name");

    try {
      // 🔥 wait for DOM to stabilize
      await new Promise((res) => setTimeout(res, 300));

      const signedBlob = await generateSignedPdf(
        getFileUrl(selectedApp.contract),
        elements,
      );
      const formData = new FormData();
      formData.append("file", signedBlob, "signed_contract.pdf");

      await signContract({
        id: selectedApp.id,
        data: formData,
      }).unwrap();

      toast.success("Contract signed successfully");
      setModalOpen(false);
      const url = URL.createObjectURL(signedBlob);
      window.open(url); // preview
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate signed contract");
    }
  };
  const handleUploadSignature = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      // 🔥 SAME as drawn signature
      addElement("signature", base64);
    };

    reader.readAsDataURL(file);
  };
  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Apply for Loan</h1>

      {/* FORM */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ================= LEFT: FORM ================= */}
        <div className="w-full lg:w-[35%] bg-white  rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Apply for Loan
          </h2>

          {/* Loan Select */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => {
                setLoanType(e.target.value);
                const selected = loanTypes.find(
                  (l: any) => l.id == e.target.value,
                );
                setSelectedLoanType(selected);
              }}
              className="w-full border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3017FE]"
            >
              <option value="">Select Loan</option>
              {loanTypes.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Amount</label>
            <input
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3017FE]"
            />
          </div>

          {/* Quick Validation */}
          {selectedLoanType && amount && (
            <p className="text-xs text-gray-500">
              Range: {selectedLoanType.currency} {selectedLoanType.min_amount} -{" "}
              {selectedLoanType.max_amount}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleApply}
            className="w-full bg-[#3017FE] hover:opacity-90 transition text-white py-2.5 rounded-lg font-medium"
          >
            {isLoading ? "Applying..." : "Apply Now"}
          </button>
        </div>

        {/* ================= RIGHT: LOAN DETAILS ================= */}
        <div className="w-full lg:flex-1">
          {selectedLoanType ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 space-y-5 transition-all">
              {/* HEADER */}
              <div className="flex justify-between items-start border-b pb-3 border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                    {selectedLoanType.name}
                  </h2>
                  {selectedLoanType.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedLoanType.description}
                    </p>
                  )}
                </div>

                <span className="text-xs bg-[#3017FE]/10 text-[#3017FE] px-3 py-1 rounded-full font-medium">
                  {selectedLoanType.currency}
                </span>
              </div>

              {/* CORE DETAILS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <Item label="Interest">
                  {selectedLoanType.interest_rate}% (
                  {selectedLoanType.interest_type})
                </Item>

                <Item label="Duration">
                  {selectedLoanType.repayment_period_value}{" "}
                  {selectedLoanType.repayment_period_unit}
                </Item>

                <Item label="Repayment">
                  {selectedLoanType.repayment_frequency}
                </Item>

                <Item label="Min Amount">
                  {selectedLoanType.currency} {selectedLoanType.min_amount}
                </Item>

                <Item label="Max Amount">
                  {selectedLoanType.currency} {selectedLoanType.max_amount}
                </Item>

                <Item label="Processing Fee">
                  {selectedLoanType.processing_fee_percentage}%
                </Item>

                <Item label="Late Penalty">
                  <span className="text-red-500">
                    {selectedLoanType.late_payment_penalty_percentage}%
                  </span>
                </Item>

                <Item label="Grace Period">
                  {selectedLoanType.grace_period_days} days
                </Item>

                <Item label="Max Loans">
                  {selectedLoanType.max_concurrent_loans}
                </Item>

                <Item label="Collateral">
                  {selectedLoanType.requires_collateral
                    ? "Required"
                    : "Not Required"}
                </Item>
              </div>

              {/* COLLATERAL */}
              {selectedLoanType.requires_collateral &&
                selectedLoanType.collateral_description && (
                  <div className="bg-yellow-50 border border-yellow-200 text-sm p-3 rounded-lg">
                    <b>Collateral:</b> {selectedLoanType.collateral_description}
                  </div>
                )}

              {/* REPAYMENT */}
              {amount && (
                <RepaymentPreview loan={selectedLoanType} amount={amount} />
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center text-sm text-gray-500">
              Select a loan type to preview details
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-start bg-gray-100">
            <tr className="text-left">
              <th className="p-3 text-left">Loan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-3">{app.loan_type_details?.name}</td>

                <td>RWF {app.requested_amount}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                      app.status,
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>

                {(app.contract) ? <td className="space-x-2">
                  {!app.is_signed && app.status === "reviewed" && (
                    <>
                      <button
                        onClick={() => openModal(app)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        E-Sign
                      </button>

                      <button
                        onClick={() => {
                          setManualDrawer(true);
                          setSelectedApp(app);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Manual
                      </button>
                    </>
                  )}
                </td>:((app.status==='reviewed')? <td className="text-xs text-gray-500 font-bold"> Wait for Your contract</td> :( app.status !=='rejected' && <td className="text-xs font-bold text-gray-500"> Apllication in Review</td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded shadow space-y-2">
            <div className="flex justify-between">
              <p className="font-semibold">{app.loan_type_details?.name}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusStyle(
                  app.status,
                )}`}
              ></span>
            </div>

            <p className="text-sm">
              Amount: <b> RF {app.requested_amount}</b>
            </p>

            {!app.is_signed && app.status === "reviewed" && (
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(app)}
                  className="flex-1 bg-green-600 text-white py-1 rounded text-xs"
                >
                  E-Sign
                </button>

                <button
                  onClick={() => {
                    setManualDrawer(true);
                    setSelectedApp(app);
                  }}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded text-xs"
                >
                  Manual
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-7xl h-[95vh] flex rounded overflow-hidden">
            {/* PDF */}

            <div
              ref={pdfWrapperRef}
              className="flex-1 overflow-auto bg-gray-300 flex flex-col items-center p-6 space-y-6"
            >
              <Document
                file={getFileUrl(selectedApp.contract)}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                <div className="flex justify-between items-center my-2 w-full max-w-xl">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span>
                    Page {currentPage} of {numPages}
                  </span>

                  <button
                    disabled={currentPage === numPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div
                  className="pdf-page relative bg-white shadow-lg"
                  style={{ width: 600 }}
                >
                  <Page pageNumber={currentPage} width={600} />

                  <div className="absolute top-0 left-0 w-full h-full">
                    {elements
                      .filter((el) => el.page === currentPage)
                      .map((el) => (
                        <Draggable
                          key={el.id}
                          nodeRef={elementRefs.current[el.id]}
                          position={{ x: el.x, y: el.y }}
                          onStop={(_, data) =>
                            updatePosition(el.id, data.x, data.y)
                          }
                        >
                          <div
                            ref={elementRefs.current[el.id]}
                            className="absolute z-50 cursor-move"
                          >
                            {el.type === "signature" ? (
                              <img src={el.value} className="w-32" />
                            ) : (
                              <span className=" px-2 text-sm font-mono text-[#3017FE]">
                                {el.value}
                              </span>
                            )}
                          </div>
                        </Draggable>
                      ))}
                  </div>
                </div>
              </Document>
            </div>

            {/* SIDE PANEL */}
            <div className="w-80 p-4 border-l space-y-3">
              <div className="py-2 z-40 shadow bg-white rounded">
                <h1 className="text-center text-gray-500 text-lg font-bold ">
                  Signature Details
                </h1>
              </div>
              <input
                placeholder="Enter your name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <button
                onClick={addName}
                className="bg-secondary rounded-full text-white w-full py-1"
              >
                Add Name
              </button>
              <div className="flex flex-col justify-center items-center">
                <p className="text-gray-500 font-bold">Upload Your Signature</p>
                <input
                  type="file"
                  accept="image/*"
                  className="border border-gray-500 rounded-full w-[80%] p-2"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadSignature(file);
                  }}
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <hr className="h-1 w-[25%]" />
                <p className="text-xs text-gray-500 font-bold">or sign here</p>
                <hr className="h-1 w-[25%]" />
              </div>
              <SignatureCanvas
                penColor="#3017FE"
                ref={sigRef}
                canvasProps={{
                  className: "border border-blue-500 w-full h-32",
                }}
              />

              <button
                onClick={saveSignature}
                className="bg-secondary  flex items-center justify-center gap-x-2 py-2 rounded-full shadow z-50 text-white w-full"
              >
                <Signature />
                Add Signature
              </button>

              <button
                onClick={handleSign}
                className="bg-green-600 flex items-center justify-center gap-x-2 py-2  rounded-full shadow z-50 text-white w-full"
              >
                <CheckCircle />
                Confirm Sign
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="text-white flex items-center justify-center gap-x-2 py-2 rounded-full bg-red-700 w-full"
              >
                <X />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {manualDrawer && selectedApp && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow z-50 p-4">
          <div className="flex justify-between mb-3">
            <h2 className="font-bold">Manual Signing</h2>
            <button
              className="hover:cursor-pointer"
              onClick={() => setManualDrawer(false)}
            >
              <X />
            </button>
          </div>

          <ol className="text-sm space-y-2">
            <li>1. Download contract</li>
            <li>2. Sign manually</li>
            <li>3. Upload signed contract</li>
          </ol>

          <a
            href={getFileUrl(selectedApp.contract)}
            target="_blank"
            className="block bg-blue-600 text-white text-center py-2 mt-3 rounded"
          >
            Download Contract
          </a>

          <input type="file" className="mt-3" />

          <button className="bg-green-600 text-white w-full py-2 mt-3 rounded">
            Upload Signed Contract
          </button>
        </div>
      )}
    </div>
  );
}
const Item = ({ label, children }: any) => (
  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-semibold text-slate-800 dark:text-white">{children}</p>
  </div>
);
const RepaymentPreview = ({ loan, amount }: any) => {
  const principal = Number(amount);
  const rate = Number(loan.interest_rate);

  let total = 0;

  if (loan.interest_type === "flat") {
    total = principal + (principal * rate) / 100;
  } else {
    // simple reducing estimate
    total = principal + (principal * rate) / 200;
  }

  const period = loan.repayment_period_value;

  const installment = total / period;

  return (
    <div className="bg-green-50 border border-green-200 p-4 rounded-xl space-y-2">
      <p className="text-green-700 font-semibold text-sm">Repayment Preview</p>

      <div className="flex justify-between text-sm">
        <span>Total Payable</span>
        <span className="font-bold text-green-800">
          {loan.currency} {total.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Per Installment</span>
        <span className="font-bold text-green-800">
          {loan.currency} {installment.toFixed(2)}
        </span>
      </div>

      <p className="text-xs text-green-600">
        Based on {loan.repayment_frequency} payments over{" "}
        {loan.repayment_period_value} {loan.repayment_period_unit}
      </p>
    </div>
  );
};
const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "reviewed":
      return "bg-blue-100 text-blue-700";

    case "approved":
      return "bg-green-100 text-green-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "disbursed":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};
