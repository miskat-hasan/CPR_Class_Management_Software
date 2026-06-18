import useClientApi from "../useClientApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../useAuth";

// get user training site data version: 2
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
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
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
    // enabled: !!token,
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
    onSuccess: data => {
      toast.success(data?.message || "Training Site Updated Successfully");
    },
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const getAllCountry = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-country"],
    isPrivate: true,
    endpoint: `/api/country`,
  });
};

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

export const getAllClient = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-clients", page, perPage],
    isPrivate: true,
    endpoint: `/api/clients?page=${page}&per_page=${perPage}`,
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

export const getAllLocation = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-location", page, perPage],
    isPrivate: true,
    endpoint: `/api/locations?page=${page}&per_page=${perPage}`,
  });
};
export const getAllTcProducts = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-tcproduct", page, perPage],
    isPrivate: true,
    endpoint: `/api/tc-product?page=${page}&per_page=${perPage}`,
  });
};

export const getSingleTcProduct = id => {
  return useClientApi({
    method: "get",
    key: ["get-single-tcproduct"],
    isPrivate: true,
    endpoint: `/api/tc-product/${id}`,
  });
};

export const createInstructor = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/instructors/store",
    onSuccess: data => {
      toast.success(data?.message || "Instructor Created Successfully");
    },
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const updateInstructor = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/instructors/${id}/update`,
  });
};

export const getAllInstructor = (
  page = 1,
  perPage = 10,
  enableSearch,
  searchValue,
) => {
  return useClientApi({
    method: "get",
    key: ["get-all-instructor", page, perPage, enableSearch],
    isPrivate: true,
    endpoint: enableSearch
      ? `/api/instructors?page=${page}&per_page=${perPage}&search=${searchValue}`
      : `/api/instructors?page=${page}&per_page=${perPage}`,
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

export const getAllCertification = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-certification", page, perPage],
    isPrivate: true,
    endpoint: `/api/certifications/index?page=${page}&per_page=${perPage}`,
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
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// have to check
export const getAllUserRole = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-roles", page, perPage],
    isPrivate: true,
    endpoint: `api/roles/index?page=${page}&per_page=${perPage}`,
  });
};

// product add ons
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

export const getAllProductAddOns = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-product-add-ons", page, perPage],
    endpoint: `/api/addon_list/index?page=${page}&per_page=${perPage}`,
  });
};

// promo code
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
    endpoint: `/api/promo-codes/update`,
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

export const getAllKeyCodeBank = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-keycode-bank", page, perPage],
    endpoint: `/api/keycode/index?page=${page}&per_page=${perPage}`,
  });
};

// card type
export const getAllCardType = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-card-type"],
    endpoint: `/api/card/index`,
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

// class
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
    key: ["get-single-class"],
    endpoint: `/api/class/show?id=${id}`,
  });
};

export const updateClass = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/class/update",
  });
};

export const getAllUpcomingClasses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-upcoming-class", page, perPage],
    endpoint: `/api/class/upcoming`,
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

// class search

export const searchClasses = (
  is_enabled,
  course_id,
  type,
  instructor_id,
  location_id,
  id,
) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: [
      "get-searched-classes",
      course_id,
      type,
      instructor_id,
      location_id,
      id,
    ],
    params: { course_id, type, instructor_id, location_id, id },
    endpoint: "/api/class/search",
    enabled: is_enabled,
    queryOptions: {
      retry: false,
    },
  });
};

// card type
export const getSecondCardType = () => {
  return useClientApi({
    method: "get",
    key: ["get-all-second-card-type"],
    isPrivate: true,
    endpoint: "/api/second_card/index",
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
    queryOptions: {
      retry: false,
    },
  });
};

// reports

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
    endpoint: `/api/reports/registration`,
  });
};

export const getPromoCodeReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-promo-code-report"],
    endpoint: `/api/reports/promo-code`,
  });
};

// --------- report download ----------

export const useExportInstructorByDisciplinePDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/reports/export-Instructors-by-discipline`,
    axiosOptions: {
      responseType: "blob",
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useExportClassByStudentPDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/reports/export-classess-by-student`,
    axiosOptions: {
      responseType: "blob",
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useExportStudentDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/reports/export-students-discipline`,
    axiosOptions: {
      responseType: "blob",
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// certification file
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
    endpoint: `/api/certificates/download`,
    axiosOptions: {
      responseType: "blob",
    },
  });
};

// help -> what's new

// get all data
export const getWhatsNew = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-whats-new"],
    endpoint: "/api/whats_new/index",
  });
};

// get single data
export const getSingleWhatsNew = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-whats-new", id],
    endpoint: `/api/whats_new/show?id=${id}`,
  });
};

// add new what's new

export const addWhatsNew = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/whats_new/store",
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

// update what's new
export const updateWhatsNew = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/whats_new/update",
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

// support request
export const storeSupportRequest = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/support_request/request",
  });
};

// External SKU
// get all data
export const getAllExternalSKU = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-external-sku", page, perPage],
    endpoint: `/api/external_sku/index?page=${page}&per_page=${perPage}`,
  });
};

// delete a data
export const deleteSingleExternalSKU = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
  });
};

// store external SKU
export const storeExternalSKU = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/external_sku/store",
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

// get class-course details for enrolment
export const getEnrollmentDetails = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    endpoint: `/api/show/course/info?id=${id}`,
  });
};

// student registration
export const useStudentEnrollment = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/registration?id=${id}`,
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// payment process
export const usePaymentProcess = () => {
  return useClientApi({
    method: "post",
    isPrivate: false,
    endpoint: `/api/student/payment/process`,
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// get student
export const useGetStudentByClassId = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student-by-class", id],
    endpoint: `/api/student/by_class?class_details_id=${id}`,
  });
};

export const useGetInstructorByDiscipline = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-instructor-by-discipline"],
    endpoint: `/api/reports/instructors-and-discipline`,
  });
};

export const useGetClassAndStudentReport = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-and-student"],
    endpoint: `/api/reports/classes-and-students`,
  });
};

export const useGetClassAndStudentByDiscipline = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-class-and-student-by-discipline"],
    endpoint: `/api/reports/classes-students-discipline`,
  });
};

export const useStoreStudentData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/store",
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useUpdateStudentData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/student/by_class",
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

// get student data
export const useGetStudent = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-student", id],
    endpoint: `/api/student/show?id=${id}`,
  });
};

// update student score data
export const useUpdateStudentScore = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/score/update`,
    onError: error => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useFinalizeRoster = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/finalize`,
    onSuccess: data => {
      queryClient.invalidateQueries(["get-student-by-class"]);
      toast.success(data?.message || "Roster finalized successfully");
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useDownloadStudentListPDF = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/export-pdf`,
    axiosOptions: {
      responseType: "blob",
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

export const useDownloadRoster = id => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/student/${id}`,
    axiosOptions: {
      responseType: "blob",
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// ----- tc product ------

// get all
export const useGetTCProduct = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-tc-product", page, perPage],
    endpoint: `/api/tc-product?page=${page}&per_page=${perPage}`,
  });
};

// store
export const useStoreTCProduct = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/tc-product`,
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// show
export const useGetSingleTCProduct = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-tc-product", id],
    endpoint: `/api/tc-product/${id}`,
  });
};

// update
export const useUpdateTCProduct = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/tc-product/${id}`,
    onSuccess: data => {
      toast.success(data?.message || "TC Product updated successfully");
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// ======== tc product order
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
      toast.success(data?.message || "Document deleted successfully");
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
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
    onSuccess: data => {
      toast.success(data?.message);
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// connect payment account
export const useConnectAccount = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/instructor-account-connect`,
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
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

// notifications

export const useGetNotifications = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-notifications"],
    endpoint: "/api/notifications",
  });
};

// get all rosters
export const useGetAllRosters = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-training-site-rosters"],
    endpoint: "/api/training-site-rosters",
  });
};

// update user data
export const useUpdateUserData = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/instructors/basic-info`,
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// ============== version 2 ===============

// get all users
export const useGetAllUsers = () => {
  const { selectedTrainingSiteId } = useAuth();
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-users"],
    endpoint: "/api/site-users",
    axiosOptions: {
      headers: { "X-Site-Id": selectedTrainingSiteId },
    },
  });
};

// store user
export const useStoreUser = () => {
  const { selectedTrainingSiteId } = useAuth();

  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/site-users/store`,
    axiosOptions: {
      headers: { "X-Site-Id": selectedTrainingSiteId },
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    isPrivate: true,
    onSuccess: data => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries(["get-all-users"]);
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// all user role
export const getAllRole = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-role"],
    endpoint: "/api/all-role",
  });
};

// store location
export const storeLocation = () => {
  const queryClient = useQueryClient();
  const { selectedTrainingSiteId } = useAuth();

  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/locations/store",
    axiosOptions: {
      headers: { "X-Site-Id": selectedTrainingSiteId },
    },
    onSuccess: data => {
      toast.success(data?.message || "Location stored successfully");
      queryClient.invalidateQueries(["get-all-locations"]);
    },
    onError: err => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
};

// store key code
export const addKeyCodeBank = () => {
  const { selectedTrainingSiteId } = useAuth();

  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/keycode/store",
    axiosOptions: {
      headers: { "X-Site-Id": selectedTrainingSiteId },
    },
  });
};

// get single key code
export const getSingleKeyCodeBank = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-keycode-bank"],
    endpoint: `/api/keycode/show?id=${id}`,
  });
};

// update key code
export const updateKeyCodeBank = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/keycode/update`,
  });
};

// delete key code bank
export const deleteKeyCodeBank = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: `/api/keycode/delete?id=${id}`,
  });
};

// delete single key code
export const deleteSingleKeyCode = id => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: `/api/keycode-bank/link/${id}`,
  });
};

// get all certifying bodies
export const getAllCertifyingBody = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-certifying-body", page, perPage],
    endpoint: `/api/course_cb/index?page=${page}&per_page=${perPage}`,
  });
};

// store certifying body
export const storeCertifyingBody = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/course_cb/store",
  });
};

// delete certifying body
export const deleteCertifyingBody = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/course_cb/delete",
  });
};

// get all disciplines
export const getAllDiscipline = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-discipline", page, perPage],
    endpoint: `/api/discipline/index?page=${page}&per_page=${perPage}`,
  });
};

// get single discipline
export const getSingleDiscipline = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-discipline", id],
    endpoint: `/api/discipline/show?id=${id}`,
    enabled: !!id,
  });
};

// store discipline
export const storeDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/discipline/store",
  });
};

// update discipline
export const updateDiscipline = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/discipline/update",
  });
};

// delete discipline
export const deleteDiscipline = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/discipline/delete",
  });
};

// =========== email campaign =================
// get all campaigns
export const getAllEmailCampaigns = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-email-campaigns"],
    endpoint: "/api/email-campaigns?type=all",
  });
};

// get single campaign
export const getSingleEmailCampaign = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-email-campaign", id],
    endpoint: `/api/email-campaigns/${id}`,
    enabled: !!id,
  });
};

// store campaign
export const storeEmailCampaign = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/email-campaigns",
  });
};

// update campaign
export const updateEmailCampaign = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/email-campaigns/${id}`,
  });
};

// delete campaign
export const deleteEmailCampaign = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/email-campaigns",
  });
};

// get single email template
export const getSingleEmailTemplate = id => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-email-template", id],
    endpoint: `/api/email-campaigns/emails/${id}`,
    enabled: !!id,
  });
};

// store email template
export const storeEmailTemplate = campaignId => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: `/api/email-campaigns/${campaignId}/emails`,
  });
};

// update email template
export const updateEmailTemplate = id => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/email-campaigns/emails/${id}`,
  });
};

// delete email template
export const deleteEmailTemplate = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/email-campaigns/emails",
  });
};

// send test email
export const sendTestEmail = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/email-campaigns/test-email",
  });
};

// get text campaign settings + messages
export const getTextCampaignSettings = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-text-campaign-settings"],
    endpoint: "/api/text-campaigns/settings",
  });
};

// update basic settings
export const updateTextCampaignSettings = () => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: "/api/text-campaigns/settings",
  });
};

// get all scheduled messages
export const getAllTextMessages = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-text-messages"],
    endpoint: "/api/text-campaigns/all-messages?type=all",
  });
};

// get single message
export const getSingleTextMessage = (id) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-text-message", id],
    endpoint: `/api/text-campaigns/messages/${id}`,
    enabled: !!id,
  });
};

// store message
export const storeTextMessage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/text-campaigns/messages",
  });
};

// update message
export const updateTextMessage = (id) => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/text-campaigns/messages/${id}`,
  });
};

// delete message
export const deleteTextMessage = () => {
  return useClientApi({
    method: "delete",
    isPrivate: true,
    endpoint: "/api/text-campaigns/messages",
  });
};

// send test message
export const sendTestTextMessage = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/text-campaigns/test-message",
  });
};

// ================ course type ================

// course
export const storeCourse = () => {
  return useClientApi({
    method: "post",
    isPrivate: true,
    endpoint: "/api/courses/store",
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

export const updateCourse = (id) => {
  return useClientApi({
    method: "put",
    isPrivate: true,
    endpoint: `/api/courses/${id}`,
  });
};
export const getAllCourses = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    key: ["get-all-course", page, perPage],
    isPrivate: true,
    endpoint: `/api/courses/index?page=${page}&per_page=${perPage}`,
  });
};

// course
export const getCourseOptions = () => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-course-type"],
    endpoint: `/api/course_option/index`,
  });
};

// ============== course image ===============
// course image
export const getAllCourseImages = (page = 1, perPage = 10) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-all-course-images", page, perPage],
    endpoint: `/api/course_image/index?page=${page}&per_page=${perPage}`,
  });
};

export const getSingleCourseImage = (id) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["get-single-course-image", id],
    endpoint: `/api/course_image/show?id=${id}`,
    enabled: !!id,
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