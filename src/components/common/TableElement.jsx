import { cn } from "@/lib/utils";
import Link from "next/link";

export const Table = ({ children, className }) => {
  return (
    <table
      className={cn(
        "w-full min-w-[800px] text-sm sm:text-base text-left text-gray-700 dark:text-[#b9b5ab]",
        className,
      )}
    >
      {children}
    </table>
  );
};

export const TableHead = ({ children, className }) => {
  return (
    <thead
      className={cn(
        "bg-gray-50 dark:bg-[#1B1D1E] text-black dark:text-gray dark:font-medium capitalize text-[16px] sm:text-[18px] font-semibold",
        className,
      )}
    >
      {children}
    </thead>
  );
};

export const TableBodyRow = ({ key, children, className }) => {
  return (
    <tr
      key={key}
      className={cn(
        "border-b dark:border-[#343536] hover:bg-gray-50 dark:hover:bg-[#1B1D1E] transition-all",
        className,
      )}
    >
      {children}
    </tr>
  );
};

export const TableButton = ({
  isLink = true,
  children,
  className,
  ...props
}) => {
  const Comp = isLink ? Link : "button";
  return (
    <Comp {...props}>
      <button
        className={cn(
          "p-1.5 sm:p-2 bg-gray-100 dark:bg-transparent dark:border dark:border-[#6b6c6d] dark:hover:bg-[#292b2c] rounded-lg hover:bg-gray-200 transition cursor-pointer",
          className,
        )}
      >
        {children}
      </button>
    </Comp>
  );
};

export const TableFooter = ({ Links, setPage, perPage, setPerPage }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-end mt-3 lg:mt-6 gap-3">
      {/* Show per page */}
      {/* <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Show:</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div> */}
      {/* Pagination */}
      <div className="flex items-center gap-2">
        {Links?.map((link, index) => (
          <button
            key={index}
            disabled={link.url === null || link.page === null}
            onClick={() => link.page && setPage(link.page)}
            className={`px-3 py-1 text-sm border rounded-md dark:text-gray ${
              link.active
                ? "border-blue-500 dark:border-gray text-blue-600 bg-blue-50 dark:bg-transparent"
                : "hover:bg-gray-100 dark:hover:bg-[#292b2c] dark:border-[#343536]"
            } ${
              link.url === null || link.page === null
                ? "text-gray-400 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
  );
};
