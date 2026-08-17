// src/hooks/useSiteAwarePagination.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";

/**
 * Pagination state ([page, setPage]) that automatically resets to page 1
 * whenever the selected training site changes. When a user switches sites
 * (e.g. super admin using the site dropdown), lists should start back at
 * the first page instead of staying on a stale page of the previous site.
 */
const useSiteAwarePagination = () => {
  const { selectedTrainingSiteId } = useAuth();
  const [page, setPage] = useState(1);
  const prevSiteId = useRef(selectedTrainingSiteId);

  useEffect(() => {
    if (prevSiteId.current !== selectedTrainingSiteId) {
      prevSiteId.current = selectedTrainingSiteId;
      setPage(1);
    }
  }, [selectedTrainingSiteId]);

  return [page, setPage];
};

export default useSiteAwarePagination;
