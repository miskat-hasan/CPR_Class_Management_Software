import useClientApi from "../useClientApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../useAuth";
import { getStoredFilters } from "@/components/enrollment/SchedulePageContent";

// ==================== AUTH / TRAINING SITE ====================

export const useGetUserTrainingSiteData = token => {
  return useClientApi({
    method: "get",
    key: ["user-training-site-data"],
    isPrivate: true,
    endpoint: "/api/training-site/my-training-site",
    enabled: !!token,
  });
};

export const useChangePassword = () => {
  return useClientApi({
    method: "post",
    endpoint: "/api/users/login/setnew-password",
    isPrivate: true,
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};

export const createSingleTrainingSite = () => {
  return useClientApi({
    method: "post",
    endpoint: "/api/training-site/create",
    isPrivate: true,
  });
};

export const getallTrainingsite = ({ page = 1, perPage = 10, type } = {}) => {
  const isAll = type === "all";
  const endpoint = isAll
    ? "/api/training-sites?type=all"
    : `/api/training-sites?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-training-site", "all"]
    : ["get-all-training-site", "paginated", page, perPage];

  return useClientApi({
    method: "get",
    key,
    isPrivate: true,
    endpoint,
  });
};

export const getSingleTrainingsite = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-training-site", id],
    isPrivate: true,
    endpoint: `/api/training-site/${id}/edit`,
  });
};

export const updateTrainingSite = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/training-site/${id}/update`,
  });
};

export const getAllCountry = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-country"],
    isPrivate: true,
    endpoint: "/api/country",
  });
};

// ==================== LOCATION ====================

export const storeLocation = () => {
  const queryClient = useQueryClient();
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/locations/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
    onSuccess: data => {
      toast.success(data?.message || "Location stored successfully");
      queryClient.invalidateQueries(["get-all-locations"]);
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

export const updateLocation = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/locations/${id}/update`,
  });
};

export const getSingleLocation = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-location", id, selectedTrainingSiteId],
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/locations/${id}`,
  });
};

export const getAllLocation = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/locations?type=all"
    : `/api/locations?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-location", "all", selectedTrainingSiteId]
    : ["get-all-location", "paginated", page, perPage, selectedTrainingSiteId];

  return useClientApi({
    method: "get",
    key,
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};
// ==================== CLIENT ====================

export const storeClient = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/clients/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

export const getSingleClient = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    key: ["get-single-client", id, selectedTrainingSiteId],
    enabled: !!id,
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/clients/${id}`,
  });
};

export const updateSingleClient = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/clients/${id}/update`,
  });
};

export const getAllClient = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/site-users?type=all&role_id[]=6"
    : `/api/clients?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-clients", "all", selectedTrainingSiteId]
    : ["get-all-clients", "paginated", page, perPage, selectedTrainingSiteId];

  return useClientApi({
    method: "get",
    key,
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

// ==================== INSTRUCTOR ====================

export const createInstructor = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/instructors/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};

export const getAllInstructor = ({
  type,
  page = 1,
  perPage = 10,
  search,
} = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  let endpoint;
  if (isAll) {
    endpoint = "/api/site-users?type=all&role_id[]=3";
  } else if (search) {
    endpoint = `/api/site-users?role_id[]=3&page=${page}&per_page=${perPage}&search=${search}`;
  } else {
    endpoint = `/api/site-users?role_id[]=3&page=${page}&per_page=${perPage}`;
  }

  const key = isAll
    ? ["get-all-instructor", "all", selectedTrainingSiteId]
    : [
        "get-all-instructor",
        "paginated",
        page,
        perPage,
        search ?? null,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    key,
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

export const getAllAssistant = ({
  type,
  page = 1,
  perPage = 10,
  search,
} = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  let endpoint;
  if (isAll) {
    endpoint = "/api/site-users?type=all&role_id[]=4";
  } else if (search) {
    endpoint = `/api/site-users?role_id[]=4&page=${page}&per_page=${perPage}&search=${search}`;
  } else {
    endpoint = `/api/site-users?role_id[]=4&page=${page}&per_page=${perPage}`;
  }

  const key = isAll
    ? ["get-all-assistant", "all", selectedTrainingSiteId]
    : [
        "get-all-assistant",
        "paginated",
        page,
        perPage,
        search ?? null,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    key,
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

// ==================== USERS ====================
export const useGetAllUsers = ({
  type,
  page = 1,
  perPage = 10,
  roleIds,
  search,
} = {}) => {
  const { selectedTrainingSiteId } = useAuth();

  const params = new URLSearchParams();
  if (type) {
    params.set("type", type);
  }

  if (type !== "all") {
    params.set("page", page);
    params.set("per_page", perPage);
  }

  if (search) {
    params.set("search", search);
  }

  roleIds?.forEach(id => params.append("role_id[]", id));

  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "get-all-users",
      type ? type : page,
      !type && perPage,
      search ?? null,
      ...(roleIds ?? []),
      selectedTrainingSiteId,
    ],
    endpoint: `/api/site-users?${params.toString()}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const storeSiteCoordinator = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    key: ["store-site-coordinator"],
    endpoint: "/api/site-coordinators/store",
    headers: { "X-Site-Id": null },
  });
};

export const useStoreUser = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/site-users/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    isPrivate: true,
    onSuccess: data => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries(["get-all-users"]);
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

export const useGetSingleUser = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-user", id, selectedTrainingSiteId],
    endpoint: `/api/site-users/${id}`,
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

export const useUpdateUser = id => {
  const queryClient = useQueryClient();
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    enabled: !!id,
    endpoint: `/api/site-users/${id}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    onSuccess: data => {
      queryClient.invalidateQueries(["get-all-users"]);
      queryClient.invalidateQueries(["get-single-user", id]);
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Failed to update user."),
  });
};

export const useUpdateAuthUser = id => {
  const queryClient = useQueryClient();
  // const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/users/data/update",
    // headers: { "X-Site-Id": selectedTrainingSiteId },
    onSuccess: data => {
      queryClient.invalidateQueries(["get-single-user", id]);
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Failed to update user."),
  });
};

export const getAllRole = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-role"],
    endpoint: "/api/all-role",
  });
};

// ==================== CERTIFICATIONS / DOCUMENTS ====================

export const storeCertification = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/certifications/store",
  });
};
export const updateCertification = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/certifications/update",
  });
};
export const getSingleCertification = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-certification", id],
    enabled: !!id,
    isPrivate: true,
    endpoint: `/api/certifications/show?id=${id}`,
  });
};

export const getAllCertifications = ({
  instructorId,
  page = 1,
  perPage = 10,
} = {}) => {
  return useClientApi({
    method: "get",
    key: ["get-all-certifications", instructorId, page, perPage],
    isPrivate: true,
    enabled: !!instructorId,
    endpoint: `/api/certifications/index?instructor_id=${instructorId}&page=${page}&per_page=${perPage}`,
  });
};

export const storeDocument = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/documents/store",
  });
};
export const getAllDocuments = ({ page = 1, perPage = 10 } = {}) => {
  return useClientApi({
    method: "get",
    key: ["get-all-documents", page, perPage],
    isPrivate: true,
    endpoint: `/api/documents/index?page=${page}&per_page=${perPage}`,
  });
};
export const deleteDocument = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    isPrivate: true,
    onSuccess: data => {
      queryClient.invalidateQueries(["get-single-instructor"]);
      toast.success(data?.message || "Document deleted successfully");
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

// ==================== PRODUCT ADD-ONS ====================

export const storeProductAddOns = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/addon_list/store",
  });
};
export const getSingleProductAddOns = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-product-add-ons", id, selectedTrainingSiteId],
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/addon_list/show?id=${id}`,
  });
};
export const updateProductAddOns = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/addon_list/update",
  });
};
export const getAllProductAddOns = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/addon_list/index?type=all"
    : `/api/addon_list/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-product-add-ons", "all", selectedTrainingSiteId]
    : [
        "get-all-product-add-ons",
        "paginated",
        page,
        perPage,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

// ==================== PROMO CODES ====================

export const storePromoCode = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/promo-codes/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getSinglePromoCode = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-promo-code", id],
    enabled: !!id,
    endpoint: `/api/promo-codes/show?id=${id}`,
  });
};
export const updatePromoCode = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/promo-codes/update",
  });
};
export const getAllPromoCode = ({ page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-promo-code", page, perPage, selectedTrainingSiteId],
    endpoint: `/api/promo-codes/index?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

// ==================== KEYCODE BANK ====================

export const addKeyCodeBank = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/keycode/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getSingleKeyCodeBank = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-keycode-bank", id, selectedTrainingSiteId],
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/keycode/show?id=${id}`,
  });
};
export const updateKeyCodeBank = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/keycode/update",
  });
};
export const deleteKeyCodeBank = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: `/api/keycode/delete?id=${id}`,
  });
};
export const deleteSingleKeyCode = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: `/api/keycode-bank/link/${id}`,
  });
};
export const getAllKeyCodeBank = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/keycode/index?type=all"
    : `/api/keycode/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-keycode-bank", "all", selectedTrainingSiteId]
    : [
        "get-all-keycode-bank",
        "paginated",
        page,
        perPage,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

// ==================== CARD TYPES ====================

export const getAllCardType = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-card-type"],
    endpoint: "/api/card/index",
  });
};
export const getSecondCardType = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-second-card-type"],
    isPrivate: true,
    endpoint: "/api/second_card/index",
  });
};
export const getCardSettings = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-card-settings"],
    endpoint: "/api/adjustment/index",
  });
};
export const updateCardSettings = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/adjustment/update",
  });
};

// ==================== EXTERNAL SKU ====================

export const getAllExternalSKU = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/external_sku/index?type=all"
    : `/api/external_sku/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-external-sku", "all", selectedTrainingSiteId]
    : [
        "get-all-external-sku",
        "paginated",
        page,
        perPage,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

export const storeExternalSKU = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/external_sku/store",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const deleteSingleExternalSKU = () => {
  return useClientApi({ method: "delete", isPrivate: true });
};

// ==================== CERTIFYING BODY ====================

export const getAllCertifyingBody = ({ type, page = 1, perPage = 10 } = {}) => {
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/course_cb/index?type=all"
    : `/api/course_cb/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-certifying-body", "all"]
    : ["get-all-certifying-body", "paginated", page, perPage];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    endpoint,
  });
};

export const storeCertifyingBody = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/course_cb/store",
  });
};
export const deleteCertifyingBody = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/course_cb/delete",
  });
};

// ==================== DISCIPLINE ====================

export const getAllDiscipline = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/discipline/index?type=all"
    : `/api/discipline/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-discipline", "all", selectedTrainingSiteId]
    : [
        "get-all-discipline",
        "paginated",
        page,
        perPage,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

export const storeDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/discipline/store",
  });
};
export const updateDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/discipline/update",
  });
};
export const deleteDiscipline = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/discipline/delete",
  });
};
export const getSingleDiscipline = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-discipline", id, selectedTrainingSiteId],
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/discipline/show?id=${id}`,
  });
};
// ==================== COURSES ====================

export const storeCourse = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/courses/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getSingleCourse = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    key: ["get-single-course", id, selectedTrainingSiteId],
    isPrivate: true,
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/courses/show?id=${id}`,
  });
};
export const updateCourse = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/courses/${id}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getAllCourses = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();

  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/courses/index?type=all"
    : `/api/courses/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-course", "all", selectedTrainingSiteId]
    : ["get-all-course", "paginated", page, perPage, selectedTrainingSiteId];

  return useClientApi({
    method: "get",
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    isPrivate: true,
    endpoint,
  });
};

// Without Authentication
export const getAllPublicCourses = () => {
  const { ts_id, instructor_id } = getStoredFilters();
  const endpoint = ts_id
    ? `/api/courses-public?site_id=${ts_id}&type=all`
    : `/api/courses-public?instructor_id=${instructor_id}&type=all`;
  return useClientApi({
    method: "get",
    key: ["get-all-public-course", ts_id, instructor_id],
    endpoint,
  });
};

// Without Authentication
export const getAllPublicInstructors = () => {
  const { ts_id } = getStoredFilters();

  return useClientApi({
    method: "get",
    key: ["get-all-public-instructors", ts_id],
    enabled: !!ts_id,
    endpoint: `/api/instructors-public?site_id=${ts_id}&type=all`,
  });
};

// Without Authentication
export const getAllPublicLocations = () => {
  const { ts_id, instructor_id } = getStoredFilters();
  const endpoint = ts_id
    ? `/api/locations-public?site_id=${ts_id}&type=all`
    : `/api/locations-public?instructor_id=${instructor_id}&type=all`;
  return useClientApi({
    method: "get",
    key: ["get-all-public-locations", ts_id, instructor_id],
    endpoint,
  });
};

export const getCourseOptions = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-course-type"],
    endpoint: "/api/course_option/index",
  });
};

// ==================== COURSE IMAGE ====================

export const getAllCourseImages = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const isAll = type === "all";

  const endpoint = isAll
    ? "/api/course_image/index?type=all"
    : `/api/course_image/index?page=${page}&per_page=${perPage}`;

  const key = isAll
    ? ["get-all-course-images", "all", selectedTrainingSiteId]
    : [
        "get-all-course-images",
        "paginated",
        page,
        perPage,
        selectedTrainingSiteId,
      ];

  return useClientApi({
    method: "get",
    isPrivate: true,
    key,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint,
  });
};

export const storeCourseImage = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/course_image/store",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const updateCourseImage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/course_image/update",
  });
};
export const deleteCourseImage = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/course_image/delete",
  });
};
export const getCourseImage = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-course-image"],
    endpoint: "/api/course_image/index",
  });
};

// ==================== CLASSES ====================

export const storeClass = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/store",
  });
};
export const getSingleClass = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-class", id, selectedTrainingSiteId],
    enabled: !!id,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/class/show?id=${id}`,
  });
};
export const updateClass = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/class/update/${id}`,
    enabled: !!id,
  });
};
export const deleteClass = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/class/delete",
  });
};
export const bulkDeleteClasses = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/bulk-delete",
  });
};
export const getAllUpcomingClasses = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-upcoming-class", page, perPage, selectedTrainingSiteId],
    endpoint: `/api/class/upcoming?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getAllPastClasses = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-past-class", page, perPage, selectedTrainingSiteId],
    endpoint: `/api/class/past?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getAllClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-classes", page, perPage],
    endpoint: `/api/class/index?page=${page}&per_page=${perPage}`,
  });
};

// Search/filter classes
export const searchClasses = ({
  enabled,
  type,
  courseId,
  instructorId,
  locationId,
  classId,
  search,
  startDate,
  endDate,
} = {}) => {
  const params = new URLSearchParams();
  if (courseId) params.append("course_id", courseId);
  if (instructorId) params.append("instructor_id", instructorId);
  if (locationId) params.append("location_id", locationId);
  if (classId) params.append("class_id", classId);
  if (search) params.append("search", search);
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "search-classes",
      type,
      courseId,
      instructorId,
      locationId,
      classId,
      search,
      startDate,
      endDate,
    ],
    endpoint:
      type === "upcoming"
        ? `/api/class/upcoming?${params.toString()}`
        : `/api/class/past?${params.toString()}`,
    enabled: !!enabled,
  });
};

// ==================== STUDENTS ====================

export const searchStudent = (
  page = 1,
  perPage = 10,
  first_name,
  last_name,
  email,
  class_details_id,
  phone_number,
  is_enabled,
) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "get-searched-student",
      page,
      perPage,
      first_name,
      last_name,
      email,
      class_details_id,
      phone_number,
      selectedTrainingSiteId,
    ],
    endpoint: `/api/student/search?page=${page}&per_page=${perPage}`,
    params: { first_name, last_name, email, class_details_id, phone_number },
    enabled: is_enabled,
    queryOptions: { retry: false },
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

export const useGetStudentByClassId = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student-by-class", id],
    endpoint: `/api/student/by_class?class_details_id=${id}`,
  });
};
export const useStoreStudentData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/store",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const useUpdateStudentData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/by_class",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetStudent = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student", id],
    endpoint: `/api/student/show?id=${id}`,
    enabled: !!id,
  });
};
export const useUpdateStudentScore = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/score/update",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const useFinalizeRoster = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/finalize",
    onSuccess: data => {
      queryClient.invalidateQueries(["get-student-by-class"]);
      toast.success(data?.message || "Roster finalized successfully");
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useDownloadStudentListPDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/export-pdf",
    responseType: "blob",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useDownloadRoster = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/${id}`,
    responseType: "blob",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

// ==================== EMAIL CAMPAIGNS ====================

export const getAllEmailCampaigns = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-email-campaigns", selectedTrainingSiteId],
    endpoint: "/api/email-campaigns?type=all",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getSingleEmailCampaign = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-email-campaign", id],
    enabled: !!id,
    endpoint: `/api/email-campaigns/${id}`,
  });
};
export const storeEmailCampaign = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/email-campaigns",
  });
};
export const updateEmailCampaign = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/email-campaigns/${id}`,
  });
};
export const deleteEmailCampaign = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/email-campaigns",
  });
};
export const getSingleEmailTemplate = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-email-template", id],
    endpoint: `/api/email-campaigns/emails/${id}`,
    enabled: !!id,
  });
};
export const storeEmailTemplate = campaignId => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/email-campaigns/${campaignId}/emails`,
  });
};
export const updateEmailTemplate = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/email-campaigns/emails/${id}`,
  });
};
export const deleteEmailTemplate = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/email-campaigns/emails",
  });
};
export const sendTestEmail = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/email-campaigns/test-email",
  });
};

// ==================== TEXT CAMPAIGNS ====================

export const getTextCampaignSettings = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-text-campaign-settings", selectedTrainingSiteId],
    endpoint: "/api/text-campaigns/settings",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const updateTextCampaignSettings = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: "/api/text-campaigns/settings",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getAllTextMessages = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-text-messages", selectedTrainingSiteId],
    endpoint: "/api/text-campaigns/all-messages?type=all",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getSingleTextMessage = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-text-message", id],
    endpoint: `/api/text-campaigns/messages/${id}`,
    enabled: !!id,
  });
};
export const storeTextMessage = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/text-campaigns/messages",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const updateTextMessage = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/text-campaigns/messages/${id}`,
  });
};
export const deleteTextMessage = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/text-campaigns/messages",
  });
};
export const sendTestTextMessage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/text-campaigns/test-message",
  });
};

// ==================== REPORTS ====================

export const getClassReport = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-report", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/class-report?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getEventLog = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-event-log", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/event-log?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getProductAddOnsReport = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-product-add-ons-report", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/addon-report?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getRegistrationReport = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-registration-report", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/registration?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const getPromoCodeReport = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-promo-code-report", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/promo-code?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const useExportInstructorByDisciplinePDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-Instructors-by-discipline",
    responseType: "blob",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useExportClassByStudentPDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-classess-by-student",
    responseType: "blob",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useExportStudentDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-students-discipline",
    responseType: "blob",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetInstructorByDiscipline = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "get-instructor-by-discipline",
      selectedTrainingSiteId,
      page,
      perPage,
    ],
    endpoint: `/api/reports/instructors-and-discipline?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const useGetClassAndStudentReport = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-and-student", selectedTrainingSiteId, page, perPage],
    endpoint: `/api/reports/classes-and-students?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const useGetClassAndStudentByDiscipline = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "get-class-and-student-by-discipline",
      selectedTrainingSiteId,
      page,
      perPage,
    ],
    endpoint: `/api/reports/classes-students-discipline?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const useGetPaymentReport = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-payment-report", selectedTrainingSiteId],
    endpoint: "/api/report/payment-report",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};
export const useGetDailyVolumeReport = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-daily-volume-report", selectedTrainingSiteId],
    endpoint: "/api/report/daily-volume-report",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

// ==================== TC PRODUCTS ====================

export const useGetTCProduct = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-tc-product", page, perPage],
    endpoint: `/api/tc-product?page=${page}&per_page=${perPage}`,
  });
};
export const useStoreTCProduct = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/tc-product",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetSingleTCProduct = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-tc-product", id],
    endpoint: `/api/tc-product/${id}`,
  });
};
export const useUpdateTCProduct = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/tc-product/${id}`,
    onSuccess: data =>
      toast.success(data?.message || "TC Product updated successfully"),
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetTCProductOrder = ({ page = 1, perPage = 10 } = {}) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-tc-product-order", page, perPage],
    endpoint: `/api/tc-product-orders?page=${page}&per_page=${perPage}`,
  });
};

export const useGetSingleTCProductOrder = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-tc-product-order", id],
    endpoint: `/api/tc-product-order/${id}`,
  });
};
export const useChangeOrderStatus = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    key: ["change-order-status", id],
    endpoint: `/api/tc-product-orders/${id}/status`,
  });
};
export const useMarkAsPaid = id => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    isPrivate: true,
    key: ["mark-as-paid", id],
    endpoint: `/api/tc-product-orders/${id}/mark-paid`,
    onSuccess: data => {
      queryClient.invalidateQueries(["change-order-status"]);
      toast.success(data?.message || "Marked as paid");
    },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetTSProductOrder = ({ id, page = 1, perPage = 10 } = {}) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-ts-product-order", id, page, perPage],
    endpoint: `/api/my/tc-product-orders/${id}?page=${page}&per_page=${perPage}`,
  });
};
export const useTSProductCheckout = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/purchase-tc-product",
    onSuccess: data => toast.success(data?.message),
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

// ==================== MISC ====================
export const useGetNotifications = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-notifications"],
    endpoint: "/api/notifications",
  });
};
export const useGetAllRosters = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-training-site-rosters"],
    endpoint: "/api/training-site-rosters",
  });
};
export const useUpdateUserData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/instructors/basic-info",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const getEnrollmentDetails = id => {
  return useClientApi({
    method: "get",
    isPrivate: false,
    endpoint: `/api/show/course/info?id=${id}`,
  });
};
export const useStudentEnrollment = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/registration?id=${id}`,
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const usePaymentProcess = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: "/api/student/payment/process",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const uploadCertification = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/certificates/store",
  });
};
export const getAllCertificationFile = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-certification-file", page, perPage],
    endpoint: `/api/certificates/index?page=${page}&per_page=${perPage}`,
  });
};
export const deleteSingleCertificationFile = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: `/api/certificates/delete?id=${id}`,
  });
};
export const downloadCertificationFile = () => {
  return useClientApi({
    method: "post",
    key: ["download-certification-file"],
    isPrivate: true,
    endpoint: "/api/certificates/download",
    responseType: "blob",
  });
};
export const getWhatsNew = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-whats-new"],
    endpoint: "/api/whats_new/index",
  });
};
export const getSingleWhatsNew = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-whats-new", id],
    enabled: !!id,
    endpoint: `/api/whats_new/show?id=${id}`,
  });
};
export const addWhatsNew = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/whats_new/store",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const updateWhatsNew = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/whats_new/update",
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};
export const storeSupportRequest = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/support_request/request",
  });
};

// ===================  SEND COMMUNICATION ====================

export const useResendConfirmationEmail = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/resend-confirmation-email",
    axiosOptions: {
      headers: { "Content-Type": "multipart/form-data" },
    },
  });
};

export const useSendCustomEmail = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/send-custom-email",
  });
};

export const useSendTextMessage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/send-text-message",
  });
};

// =================== SITE SETTINGS ==========================
export const useGetSiteSettings = group => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    key: ["get-site-settings", group, selectedTrainingSiteId],
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: `/api/settings/index?group=${group}`,
  });
};

export const useUpdateSiteSettings = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    endpoint: "/api/settings/update",
  });
};

// ── Custom Registration Questions ──

export const useGetRegistrationQuestions = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    key: ["get-registration-questions", page, perPage, selectedTrainingSiteId],
    isPrivate: true,
    endpoint: `/api/registration-questions?page=${page}&per_page=${perPage}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

// GET
export const useGetSingleRegistrationQuestion = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    key: ["get-single-registration-question", id, selectedTrainingSiteId],
    isPrivate: true,
    enabled: !!id,
    endpoint: `/api/registration-questions/${id}`,
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

// POST
export const useCreateRegistrationQuestion = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/registration-questions",
    headers: { "X-Site-Id": selectedTrainingSiteId },
  });
};

// PUT
export const useUpdateRegistrationQuestion = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    enabled: !!id,
    endpoint: `/api/registration-questions/${id}`,
  });
};

// DELETE
export const useDeleteRegistrationQuestion = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    enabled: !!id,
    endpoint: `/api/registration-questions/${id}`,
  });
};

// course schedule data (public api)
export const useGetCourseSchedule = (siteId, instructorId, filters = {}) => {
  const params = {
    ...(siteId ? { training_site_id: siteId } : {}),
    ...(instructorId ? { instructor_id: instructorId } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.course_id ? { course_id: filters.course_id } : {}),
    ...(filters.location_id ? { location_id: filters.location_id } : {}),
    ...(filters.instructor_id ? { instructor_id: filters.instructor_id } : {}),
    ...(filters.date ? { date: filters.date } : {}),
    ...(filters.from_time ? { from_time: filters.from_time } : {}),
    ...(filters.to_time ? { to_time: filters.to_time } : {}),
    ...(filters.page ? { page: filters.page } : {}),
  };

  return useClientApi({
    method: "get",
    isPrivate: false,
    params,
    key: ["get-course-schedule", siteId, JSON.stringify(params)],
    endpoint: "/api/courses-with-classes",
  });
};

// student upcoming classes (student dashboard)
export const getStudentUpcomingClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student-upcoming-classes", page, perPage],
    endpoint: `/api/student/upcoming-classes?page=${page}&per_page=${perPage}`,
  });
};

export const getStudentPastClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student-past-classes", page, perPage],
    endpoint: `/api/student/past-classes?page=${page}&per_page=${perPage}`,
  });
};

export const getClientUpcomingClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["client-upcoming", page, perPage],
    endpoint: `/api/clients/upcoming-classes?page=${page}&per_page=${perPage}`,
  });
};

export const getClientPastClasses = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    headers: { "X-Site-Id": selectedTrainingSiteId },
    key: ["client-past", page, perPage, selectedTrainingSiteId],
    endpoint: `/api/clients/past-classes?page=${page}&per_page=${perPage}`,
  });
};

// ==================== PAYMENT ONBOARDING ====================

export const useCheckPaymentStatus = (userId, siteId) => {
  return useClientApi({
    method: "get",
    key: ["payment-status", userId, siteId],
    isPrivate: true,
    endpoint: `/api/payment-onboarding/check-status/${userId}/${siteId}`,
    enabled: !!userId && !!siteId,
  });
};

export const useSavePaymentCredentials = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/payment-onboarding/save-credentials",
  });
};

// ============= user documents ============
export const useGetUserDocuments = ({ userId, perPage = 10 }) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    enabled: !!userId,
    key: ["user-documents", userId, perPage],
    endpoint: `/api/user-documents?user_id=${userId}&per_page=${perPage}`,
  });
};

export const useStoreUserDocument = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/user-documents/store",
  });
};

export const useDeleteUserDocument = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
  });
};
