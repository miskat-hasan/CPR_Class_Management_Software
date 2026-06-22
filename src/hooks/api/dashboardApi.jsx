import useClientApi from "../useClientApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../useAuth";

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

export const getallTrainingsite = (token, page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-training-site", page, perPage],
    isPrivate: true,
    endpoint: `/api/training-sites?page=${page}&per_page=${perPage}`,
  });
};

export const getSingleTrainingsite = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-training-site"],
    isPrivate: true,
    endpoint: `/api/training-site/edit/${id}`,
  });
};

export const updateTrainingSite = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/training-site/update/${id}`,
    onSuccess: data =>
      toast.success(data?.message || "Training Site Updated Successfully"),
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
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
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-location"],
    endpoint: `/api/locations/${id}`,
  });
};

// type=all → for dropdowns, paginated → for tables
export const getAllLocation = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();

  const endpoint =
    type === "all"
      ? "/api/locations?type=all"
      : `/api/locations?page=${page}&per_page=${perPage}`;

  return useClientApi({
    method: "get",
    key: ["get-all-location", type ?? page, perPage],
    isPrivate: true,
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
    endpoint,
  });
};

// ==================== CLIENT ====================

export const storeClient = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/clients/store",
  });
};

export const getSingleClient = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-client"],
    isPrivate: true,
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

  const endpoint =
    type === "all"
      ? "/api/site-users?type=all&role_id=6"
      : `/api/clients?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    key: ["get-all-clients", type ?? page, perPage],
    isPrivate: true,
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
    endpoint,
  });
};

// ==================== INSTRUCTOR ====================

export const createInstructor = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/instructors/store",
    onSuccess: data =>
      toast.success(data?.message || "Instructor Created Successfully"),
    onError: error =>
      toast.error(error?.response?.data?.message || "Something went wrong!"),
  });
};

export const updateInstructor = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/instructors/${id}/update`,
  });
};

export const getSingleInstructor = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-instructor", id],
    isPrivate: true,
    endpoint: `/api/single-instructors?id=${id}`,
  });
};

export const getAllInstructor = ({
  type,
  page = 1,
  perPage = 10,
  search,
} = {}) => {
  const { selectedTrainingSiteId } = useAuth();

  let endpoint;

  if (type === "all") {
    endpoint = "/api/site-users?type=all&role_id=3";
  } else if (search) {
    endpoint = `/api/instructors?page=${page}&per_page=${perPage}&search=${search}`;
  } else {
    endpoint = `/api/instructors?page=${page}&per_page=${perPage}`;
  }

  return useClientApi({
    method: "get",
    key: ["get-all-instructor", type ?? page, perPage, search],
    isPrivate: true,
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
    endpoint,
  });
};

// ==================== USERS ====================

export const useGetAllUsers = (page = 1, perPage = 10) => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-users", page, perPage],
    endpoint: `/api/site-users?page=${page}&per_page=${perPage}`,
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
  });
};

export const useStoreUser = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/site-users/store",
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
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

export const getAllRole = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-role"],
    endpoint: "/api/all-role",
  });
};

// Get users by role — generic
export const getUsersByRole = (
  roleId,
  { type, page = 1, perPage = 10 } = {},
) => {
  const endpoint =
    type === "all"
      ? `/api/site-users?type=all&role_id=${roleId}`
      : `/api/site-users?page=${page}&per_page=${perPage}&role_id=${roleId}`;
  return useClientApi({
    method: "get",
    key: ["get-users-by-role", roleId, type ?? page, perPage],
    isPrivate: true,
    endpoint,
    enabled: !!roleId,
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
    key: ["get-single-certification"],
    isPrivate: true,
    endpoint: `/api/certifications/show?id=${id}`,
  });
};
export const storeDocument = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/documents/store",
  });
};
export const getAllDocuments = (page = 1, perPage = 10) => {
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-product-add-ons"],
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
  const endpoint =
    type === "all"
      ? "/api/addon_list/index?type=all"
      : `/api/addon_list/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-product-add-ons", type ?? page, perPage],
    endpoint,
  });
};

// ==================== PROMO CODES ====================

export const storePromoCode = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/promo-codes/store",
  });
};
export const getSinglePromoCode = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-promo-code"],
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
export const getAllPromoCode = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-promo-code", page, perPage],
    endpoint: `/api/promo-codes/index?page=${page}&per_page=${perPage}`,
  });
};

// ==================== KEYCODE BANK ====================

export const addKeyCodeBank = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/keycode/store",
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
  });
};
export const getSingleKeyCodeBank = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-keycode-bank"],
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
  const endpoint =
    type === "all"
      ? "/api/keycode/index?type=all"
      : `/api/keycode/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-keycode-bank", type ?? page, perPage],
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
  const endpoint =
    type === "all"
      ? "/api/external_sku/index?type=all"
      : `/api/external_sku/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-external-sku", type ?? page, perPage],
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
  const { selectedTrainingSiteId } = useAuth();

  const endpoint =
    type === "all"
      ? "/api/course_cb/index?type=all"
      : `/api/course_cb/index?page=${page}&per_page=${perPage}`;

  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-certifying-body", type ?? page, perPage],
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
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
  const endpoint =
    type === "all"
      ? "/api/discipline/index?type=all"
      : `/api/discipline/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-discipline", type ?? page, perPage],
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-discipline", id],
    endpoint: `/api/discipline/show?id=${id}`,
    enabled: !!id,
  });
};

// ==================== COURSES ====================

export const storeCourse = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/courses/store",
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
  });
};
export const getSingleCourse = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-course"],
    isPrivate: true,
    endpoint: `/api/courses/show?id=${id}`,
  });
};
export const updateCourse = id => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/courses/${id}`,
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
  });
};
export const getAllCourses = ({ type, page = 1, perPage = 10 } = {}) => {
  const { selectedTrainingSiteId } = useAuth();
  const endpoint =
    type === "all"
      ? "/api/courses/index?type=all"
      : `/api/courses/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    key: ["get-all-course", type ?? page, perPage],
    axiosOptions: { headers: { "X-Site-Id": selectedTrainingSiteId } },
    isPrivate: true,
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
  const endpoint =
    type === "all"
      ? "/api/course_image/index?type=all"
      : `/api/course_image/index?page=${page}&per_page=${perPage}`;
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-course-images", type ?? page, perPage],
    endpoint,
  });
};
export const storeCourseImage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/course_image/store",
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-class", id],
    endpoint: `/api/class/show?id=${id}`,
    enabled: !!id,
  });
};
export const updateClass = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/class/update/${id}`,
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-upcoming-class", page, perPage],
    endpoint: `/api/class/upcoming?page=${page}&per_page=${perPage}`,
  });
};
export const getAllPastClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-past-class", page, perPage],
    endpoint: `/api/class/past?page=${page}&per_page=${perPage}`,
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
  if (type) params.append("type", type);
  if (courseId) params.append("course_id", courseId);
  if (instructorId) params.append("instructor_id", instructorId);
  if (locationId) params.append("location_id", locationId);
  if (classId) params.append("class_id", classId);
  if (search) params.append("search", search);
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  console.log("enabled", !!enabled);

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
    endpoint: `/api/class/search?${params.toString()}`,
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
  is_enabled,
) => {
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
    ],
    endpoint: `/api/student/search?page=${page}&per_page=${perPage}`,
    params: { first_name, last_name, email, class_details_id },
    enabled: is_enabled,
    queryOptions: { retry: false },
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
    axiosOptions: { responseType: "blob" },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useDownloadRoster = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/${id}`,
    axiosOptions: { responseType: "blob" },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};

// ==================== EMAIL CAMPAIGNS ====================

export const getAllEmailCampaigns = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-email-campaigns"],
    endpoint: "/api/email-campaigns?type=all",
  });
};
export const getSingleEmailCampaign = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-email-campaign", id],
    endpoint: `/api/email-campaigns/${id}`,
    enabled: !!id,
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-text-campaign-settings"],
    endpoint: "/api/text-campaigns/settings",
  });
};
export const updateTextCampaignSettings = () => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: "/api/text-campaigns/settings",
  });
};
export const getAllTextMessages = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-text-messages"],
    endpoint: "/api/text-campaigns/all-messages?type=all",
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
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/text-campaigns/messages",
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
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-report", page, perPage],
    endpoint: `/api/reports/class-report?page=${page}&per_page=${perPage}`,
  });
};
export const getEventLog = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-event-log", page, perPage],
    endpoint: `/api/reports/event-log?page=${page}&per_page=${perPage}`,
  });
};
export const getProductAddOnsReport = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-product-add-ons-report", page, perPage],
    endpoint: `/api/reports/addon-report?page=${page}&per_page=${perPage}`,
  });
};
export const getRegistrationReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-registration-report"],
    endpoint: "/api/reports/registration",
  });
};
export const getPromoCodeReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-promo-code-report"],
    endpoint: "/api/reports/promo-code",
  });
};
export const useExportInstructorByDisciplinePDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-Instructors-by-discipline",
    axiosOptions: { responseType: "blob" },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useExportClassByStudentPDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-classess-by-student",
    axiosOptions: { responseType: "blob" },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useExportStudentDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/reports/export-students-discipline",
    axiosOptions: { responseType: "blob" },
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
export const useGetInstructorByDiscipline = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-instructor-by-discipline"],
    endpoint: "/api/reports/instructors-and-discipline",
  });
};
export const useGetClassAndStudentReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-and-student"],
    endpoint: "/api/reports/classes-and-students",
  });
};
export const useGetClassAndStudentByDiscipline = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-and-student-by-discipline"],
    endpoint: "/api/reports/classes-students-discipline",
  });
};
export const useGetPaymentReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-payment-report"],
    endpoint: "/api/report/payment-report",
  });
};
export const useGetDailyVolumeReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-daily-volume-report"],
    endpoint: "/api/report/daily-volume-report",
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
export const useGetTCProductOrder = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-tc-product-order", page, perPage],
    endpoint: `/api/tc-product-orders?page=${page}`,
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
export const useGetTSProductOrder = (id, page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-ts-product-order", id, page, perPage],
    endpoint: `/api/my/tc-product-orders/${id}?page=${page}`,
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

export const getAllUserRole = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-roles", page, perPage],
    isPrivate: true,
    endpoint: `api/roles/index?page=${page}&per_page=${perPage}`,
  });
};
export const useConnectAccount = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/instructor-account-connect",
    onError: err =>
      toast.error(err?.response?.data?.message || "Something went wrong!"),
  });
};
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
    isPrivate: true,
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
    axiosOptions: { responseType: "blob" },
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
