"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableBodyRow,
  TableButton,
  TableFooter,
} from "@/components/common/TableElement";
import ConfirmModal from "@/components/common/ConfirmModal";
import { LucideTrash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteSingleKeyCode } from "@/hooks/api/dashboardApi";

const PER_PAGE = 10;

const formatDate = iso => {
  if (!iso) return "---";
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export default function KeycodeLinksTable({
  links = [],
  isLoading,
  onRefetch,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteLinkTarget, setDeleteLinkTarget] = useState(null);

  const { mutate: deleteLinkMutate, isPending: isDeletingLink } =
    deleteSingleKeyCode();

  const filteredLinks = useMemo(() => {
    if (!search.trim()) return links;
    const q = search.toLowerCase();
    return links.filter(
      l =>
        l.course_link?.toLowerCase().includes(q) ||
        l.label?.toString().includes(q),
    );
  }, [links, search]);

  const totalPages = Math.ceil(filteredLinks.length / PER_PAGE);
  const pagedLinks = filteredLinks.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const paginationLinks = useMemo(() => {
    const result = [];
    result.push({
      label: "&laquo;",
      page: page > 1 ? page - 1 : null,
      url: page > 1 ? "#" : null,
      active: false,
    });
    for (let i = 1; i <= totalPages; i++) {
      result.push({ label: String(i), page: i, url: "#", active: i === page });
    }
    result.push({
      label: "&raquo;",
      page: page < totalPages ? page + 1 : null,
      url: page < totalPages ? "#" : null,
      active: false,
    });
    return result;
  }, [page, totalPages]);

  const handleDeleteLink = () => {
    deleteLinkMutate(
      { endpoint: `/api/keycode-bank/link/${deleteLinkTarget.id}` },
      {
        onSuccess: res => {
          toast.success(res?.message || "Link removed");
          setDeleteLinkTarget(null);
          onRefetch();
        },
        onError: err => {
          toast.error(err?.response?.data?.message || "Failed to remove");
          setDeleteLinkTarget(null);
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header + search */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h6 className="font-semibold text-base text-black dark:text-gray">
            Keycodes / Course Links
            {!isLoading && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({filteredLinks.length} total)
              </span>
            )}
          </h6>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Search:
            </label>
            <input
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search links..."
              className="border border-gray-300 dark:border-gray-600 dark:bg-black dark:text-gray rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-52"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">#</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Date Added
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Date Assigned
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Registrant
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Keycode / Course Link
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </TableHead>
              <tbody>
                {pagedLinks.length > 0 ? (
                  pagedLinks.map(link => (
                    <TableBodyRow key={link.id}>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {link.label}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(link.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        ---
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                        ---
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        <p
                          // href={link.course_link}
                          // target="_blank"
                          // rel="noopener noreferrer"
                          className="break-all" //text-brown hover:underline
                        >
                          {link.course_link}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <TableButton
                          isLink={false}
                          type="button"
                          onClick={() => setDeleteLinkTarget(link)}
                        >
                          <LucideTrash2 className="size-4 text-gray-500 dark:text-gray" />
                        </TableButton>
                      </td>
                    </TableBodyRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-400 italic text-sm"
                    >
                      {search
                        ? "No links match your search."
                        : "No links found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <TableFooter
            Links={paginationLinks}
            setPage={setPage}
            perPage={PER_PAGE}
            setPerPage={() => {}}
          />
        )}
      </div>

      <ConfirmModal
        open={!!deleteLinkTarget}
        title="Remove this link?"
        description={`This will permanently remove: ${deleteLinkTarget?.course_link}`}
        confirmLabel="Remove Link"
        onConfirm={handleDeleteLink}
        onCancel={() => setDeleteLinkTarget(null)}
        isPending={isDeletingLink}
      />
    </>
  );
}
