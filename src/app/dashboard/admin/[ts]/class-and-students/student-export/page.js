"use client";

import { useState } from "react";
import Papa from "papaparse";
import CustomSelect from "@/components/shared/form/CustomSelect";
import SectionTitle from "@/components/common/SectionTitle";

const DUMMY_STUDENTS = [
  {
    id: "S-001",
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
    registered: "2025-10-01",
  },
  {
    id: "S-002",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Graduated",
    registered: "2025-10-03",
  },
  {
    id: "S-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "Active",
    registered: "2025-10-05",
  },
  {
    id: "S-004",
    name: "Emily Davis",
    email: "emily@example.com",
    status: "Withdrawn",
    registered: "2025-09-15",
  },
  {
    id: "S-005",
    name: "David Brown",
    email: "david@example.com",
    status: "Active",
    registered: "2025-09-28",
  },
];

const dateRangeOptions = [
  { label: "All Time", value: "all-time" },
  { label: "Last 30 Days", value: "last-30" },
  { label: "Last 90 Days", value: "last-90" },
];

const monthOptions = [
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Year", value: "this-year" },
];

export default function StudentExport() {
  const [dateRange, setDateRange] = useState("");
  const [month, setMonth] = useState("this-month");
  const [isDownloading, setIsDownloading] = useState(false);

  const getFilteredData = () => {
    console.log("Filtering by:", { dateRange, month });
    return DUMMY_STUDENTS;
  };

  const handleExport = () => {
    if (isDownloading) return;

    const dataToExport = getFilteredData();

    if (!dataToExport || dataToExport.length === 0) {
      alert("There is no data to export for the selected filters.");
      return;
    }

    setIsDownloading(true);

    try {
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student-export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("An error occurred while exporting the data.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className=" max-w-full  ">
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-black p-3 lg:p-6 shadow-sm">
        <SectionTitle title={"Student Export"} />

        <div className="mt-2 flex items-center gap-2.5 ">
          <CustomSelect
            id="date-range"
            label="Dates"
            placeholder="Registration Dates"
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            defaultValue=""
            className={"flex-1"}
          />

          <CustomSelect
            id="month"
            label="Month"
            placeholder="Select a month"
            options={monthOptions}
            value={month}
            onChange={setMonth}
            defaultValue="this-month"
            className={"flex-1"}
          />

          <div>
            <button
              onClick={handleExport}
              disabled={isDownloading}
              title="Export"
              className="flex h-[40px] lg:h-[48px] w-12 items-center justify-center rounded-md border border-brown bg-brown dark:bg-dark-brown text-white hover:text-brown cursor-pointer transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDownloading ? (
                <svg
                  className="lg:h-5 h-3 w-3  lg:w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2.5 lg:mt-5 rounded-xl border border-gray-200 bg-white dark:bg-black p-2.5 lg:p-5 text-[12px] md:text-sm leading-relaxed text-gray-600">
        This page will produce an Excel Export of your students including all
        pertinent class and registration information. Select your desired date
        range below and click Go to generate the report. If you are using Office
        2007 or later, Excel Wi display a file format warning dialog before
        loading the file. Click Yes on the dialog box and the file will be
        displayed.
      </div>
    </div>
  );
}
