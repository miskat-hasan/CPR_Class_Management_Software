const TableSkeleton = ({ rows = 5, columns = 5, showFooter = true }) => {
  return (
    <div className="p-[13px] lg:p-[26px] bg-white dark:bg-black rounded-[14px] flex flex-col gap-[12px] lg:gap-[24px] animate-pulse">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full">
          {/* Header Skeleton */}
          <thead className="bg-gray-50 dark:bg-neutral-900">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-3 sm:px-6 py-4">
                  <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-3/4" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b dark:border-neutral-800">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Skeleton */}
      {showFooter && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-3">
          <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-10 bg-gray-200 dark:bg-neutral-800 rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;