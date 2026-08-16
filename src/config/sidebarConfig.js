// src/config/sidebarConfig.js
export const getSidebarMenu = ({ role, ts }) => {
  if (role === "Super Admin" && String(ts) === "1") {
    return superAdminFullMenu(ts);
  }
  if (role === "Super Admin") {
    return superAdminSiteMenu(ts);
  }
  if (role === "Admin") {
    return adminMenu(ts);
  }
  if (role === "Instructor") {
    return instructorMenu(ts);
  }
  if (role === "Instructor Assistant") {
    return assistantMenu(ts);
  }
  if (role === "Student") {
    return studentMenu();
  }
  if (role === "Client") {
    return clientMenu();
  }
  if (role === "Site Coordinator") {
    return coordinatorMenu(ts);
  }
};

const studentMenu = () => [
  {
    label: "Classes",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/student/classes/upcoming-classes`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/student/classes/past-classes`,
      },
      {
        label: "Reschedule",
        href: `/dashboard/student/classes/reschedule`,
      },

      {
        label: "Enrollment",
        href: `/dashboard/student/classes/enrollment`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "My Profile",
        href: `/dashboard/student/settings/profile`,
      },
      {
        label: "My Certificates",
        href: `/dashboard/student/settings/certificates`,
      },
      {
        label: "Support Request",
        href: `/dashboard/student/settings/support-request`,
      },
    ],
  },
];

const clientMenu = () => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/client/class-and-students/upcoming-classes`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/client/class-and-students/past-classes`,
      },
      {
        label: "Students",
        href: `/dashboard/client/class-and-students/students`,
      },
    ],
  },
];

const superAdminFullMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/super-admin/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/super-admin/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/super-admin/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/super-admin/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/super-admin/clients/manage-clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/super-admin/clients/add-client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/super-admin/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/super-admin/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "Training Center",
    submenu: [
      {
        label: "Training Sites",
        href: `/dashboard/super-admin/training-center/training-sites`,
      },
      {
        label: "Training Site Rosters",
        href: `/dashboard/super-admin/training-center/training-site-rosters`,
      },
      {
        label: "TC Products",
        href: `/dashboard/super-admin/training-center/tc-products`,
      },
      {
        label: "TC Product Orders",
        href: `/dashboard/super-admin/training-center/tc-product-orders`,
      },
    ],
  },
  {
    label: "Courses",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/super-admin/courses/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/super-admin/courses/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/super-admin/courses/online-keycodes`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/super-admin/courses/external-sku`,
      },
      {
        label: "Discipline",
        href: `/dashboard/super-admin/courses/discipline`,
      },
      {
        label: "Course Certifying Body",
        href: `/dashboard/super-admin/courses/certifying-body`,
      },
      {
        label: "Course Image",
        href: `/dashboard/super-admin/courses/course-image`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      { label: "Users", href: `/dashboard/super-admin/settings/users` },
      {
        label: "Certificates",
        href: `/dashboard/super-admin/settings/certificates`,
      },
      {
        label: "Locations",
        href: `/dashboard/super-admin/settings/location`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/super-admin/settings/promo-codes`,
      },
      {
        label: "Email Campaigns",
        href: `/dashboard/super-admin/settings/email-campaigns`,
      },
      {
        label: "Test Messaging",
        href: `/dashboard/super-admin/settings/text-messaging`,
      },
      {
        label: "Card Settings",
        href: `/dashboard/super-admin/settings/cards-settings`,
      },
      {
        label: "Payment Account",
        href: `/dashboard/super-admin/settings/payment-account`,
      },
      {
        label: "Site Settings",
        href: `/dashboard/super-admin/settings/site-settings`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/super-admin/reports/activity-reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/super-admin/reports/class-reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/super-admin/reports/product-addon-report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/super-admin/reports/promo-code-report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/super-admin/reports/registration-report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/super-admin/reports/event-log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/super-admin/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/super-admin/help/whats-new`,
      },
    ],
  },
];

const superAdminSiteMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/super-admin/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/super-admin/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/super-admin/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/super-admin/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/super-admin/clients/manage-clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/super-admin/clients/add-client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/super-admin/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/super-admin/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "TS Management",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/super-admin/training-center/training-site-rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/super-admin/training-center/tc-products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/super-admin/training-center/tc-product-orders`,
      },
    ],
  },
  {
    label: "Courses",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/super-admin/courses/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/super-admin/courses/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/super-admin/courses/online-keycodes`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/super-admin/courses/external-sku`,
      },
      {
        label: "Discipline",
        href: `/dashboard/super-admin/courses/discipline`,
      },
      {
        label: "Course Image",
        href: `/dashboard/super-admin/courses/course-image`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      { label: "Users", href: `/dashboard/super-admin/settings/users` },
      {
        label: "Certificates",
        href: `/dashboard/super-admin/settings/certificates`,
      },
      {
        label: "Locations",
        href: `/dashboard/super-admin/settings/location`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/super-admin/settings/promo-codes`,
      },
      {
        label: "Email Campaigns",
        href: `/dashboard/super-admin/settings/email-campaigns`,
      },
      {
        label: "Test Messaging",
        href: `/dashboard/super-admin/settings/text-messaging`,
      },
      {
        label: "Site Settings",
        href: `/dashboard/super-admin/settings/site-settings`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/super-admin/reports/activity-reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/super-admin/reports/class-reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/super-admin/reports/product-addon-report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/super-admin/reports/promo-code-report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/super-admin/reports/registration-report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/super-admin/reports/event-log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/super-admin/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/super-admin/help/whats-new`,
      },
    ],
  },
];

const coordinatorMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/site-coordinator/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/site-coordinator/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/site-coordinator/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/site-coordinator/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/site-coordinator/clients/manage-clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/site-coordinator/clients/add-client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/site-coordinator/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/site-coordinator/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "TS Management",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/site-coordinator/ts-management/training-site-rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/site-coordinator/ts-management/tc-products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/site-coordinator/ts-management/ts-product-orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/site-coordinator/ts-management/order-tc-product`,
      },
      {
        label: "Course Documents",
        href: `/dashboard/site-coordinator/ts-management/course-documents`,
      },
    ],
  },
  {
    label: "Courses",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/site-coordinator/courses/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/site-coordinator/courses/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/site-coordinator/courses/online-keycodes`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/site-coordinator/courses/external-sku`,
      },
      {
        label: "Discipline",
        href: `/dashboard/site-coordinator/courses/discipline`,
      },
      {
        label: "Course Image",
        href: `/dashboard/site-coordinator/courses/course-image`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      { label: "Users", href: `/dashboard/site-coordinator/settings/users` },
      {
        label: "Certificates",
        href: `/dashboard/site-coordinator/settings/certificates`,
      },
      {
        label: "Locations",
        href: `/dashboard/site-coordinator/settings/location`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/site-coordinator/settings/promo-codes`,
      },
      {
        label: "Email Campaigns",
        href: `/dashboard/site-coordinator/settings/email-campaigns`,
      },
      {
        label: "Test Messaging",
        href: `/dashboard/site-coordinator/settings/text-messaging`,
      },
      {
        label: "Payment Account",
        href: `/dashboard/site-coordinator/settings/payment-account`,
      },
      {
        label: "Site Settings",
        href: `/dashboard/site-coordinator/settings/site-settings`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/site-coordinator/reports/activity-reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/site-coordinator/reports/class-reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/site-coordinator/reports/product-addon-report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/site-coordinator/reports/promo-code-report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/site-coordinator/reports/registration-report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/site-coordinator/reports/event-log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/site-coordinator/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/site-coordinator/help/whats-new`,
      },
    ],
  },
];

const adminMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/admin/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/admin/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/admin/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/admin/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/admin/clients/manage-clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/admin/clients/add-client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/admin/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/admin/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "TS Management",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/admin/ts-management/training-site-rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/admin/ts-management/ts-products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/admin/ts-management/ts-product-orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/admin/ts-management/order-tc-product`,
      },
      {
        label: "Course Documents",
        href: `/dashboard/admin/ts-management/course-documents`,
      },
    ],
  },
  {
    label: "Courses",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/admin/courses/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/admin/courses/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/admin/courses/online-keycodes`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/admin/courses/external-sku`,
      },
      {
        label: "Discipline",
        href: `/dashboard/admin/courses/discipline`,
      },
      {
        label: "Course Image",
        href: `/dashboard/admin/courses/course-image`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      { label: "Users", href: `/dashboard/admin/settings/users` },
      {
        label: "Certificates",
        href: `/dashboard/admin/settings/certificates`,
      },
      {
        label: "Locations",
        href: `/dashboard/admin/settings/location`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/admin/settings/promo-codes`,
      },
      {
        label: "Email Campaigns",
        href: `/dashboard/admin/settings/email-campaigns`,
      },
      {
        label: "Test Messaging",
        href: `/dashboard/admin/settings/text-messaging`,
      },
      {
        label: "Site Settings",
        href: `/dashboard/admin/settings/site-settings`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/admin/reports/activity-reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/admin/reports/class-reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/admin/reports/product-addon-report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/admin/reports/promo-code-report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/admin/reports/registration-report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/admin/reports/event-log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/admin/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/admin/help/whats-new`,
      },
    ],
  },
];

const instructorMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/instructor/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/instructor/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/instructor/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/instructor/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "TS Management",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/instructor/ts-management/training-site-rosters`,
      },
      {
        label: "Order TS Product",
        href: `/dashboard/instructor/ts-management/order-ts-product`,
      },
      {
        label: "Course Documents",
        href: `/dashboard/instructor/ts-management/course-documents`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Locations",
        href: `/dashboard/instructor/settings/location`,
      },
      {
        label: "My Instructor Profile",
        href: `/dashboard/instructor/settings/location`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/instructor/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/instructor/help/whats-new`,
      },
    ],
  },
];

const assistantMenu = ts => [
  {
    label: "Classes and Students",
    submenu: [
      {
        label: "Upcoming Classes",
        href: `/dashboard/instructor/class-and-students/upcoming-classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/instructor/class-and-students/schedule-class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/instructor/class-and-students/past-classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/instructor/class-and-students/student-search`,
      },
    ],
  },
  {
    label: "Training Site",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/instructor/training-center/training-site-rosters`,
      },
      {
        label: "Order TS Product",
        href: `/dashboard/instructor/training-center/order-ts-product`,
      },
      {
        label: "Course Documents",
        href: `/dashboard/instructor/training-center/course-documents`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Locations",
        href: `/dashboard/instructor/settings/location`,
      },
      {
        label: "My Instructor Profile",
        href: `/dashboard/instructor/settings/location`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "TS Support Request",
        href: `/dashboard/instructor/help/support-request`,
      },
      {
        label: "TC Support Request",
        href: `/dashboard/instructor/help/support-request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/instructor/help/whats-new`,
      },
    ],
  },
];
