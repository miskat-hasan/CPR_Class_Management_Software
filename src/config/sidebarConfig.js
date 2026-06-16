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
  return [];
};

const studentMenu = () => [
  {
    label: "Classes",
    submenu: [
      {
        label: "My Upcoming Classes",
        href: `/dashboard/student/classes/upcoming-classes`,
      },
      {
        label: "My Past Classes",
        href: `/dashboard/student/classes/past-classes`,
      },
      {
        label: "Reschedule My Upcoming Classes",
        href: `/dashboard/student/classes/reschedule-upcoming-classes`,
      },
      {
        label: "Reschedule to Another Course",
        href: `/dashboard/student/classes/reschedule-course`,
      },
      {
        label: "Enroll in New Class",
        href: `/dashboard/student/classes/enroll-new-class`,
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
        href: `/dashboard/super-admin/${ts}/class_and_students/upcoming_classes`,
      },
      {
        label: "Schedule a Class",
        href: `/dashboard/super-admin/${ts}/class_and_students/schedule_class`,
      },
      {
        label: "Past Classes",
        href: `/dashboard/super-admin/${ts}/class_and_students/past_class`,
      },
      {
        label: "Student Search",
        href: `/dashboard/super-admin/${ts}/class_and_students/student_search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/super-admin/${ts}/clients/manage_clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/super-admin/${ts}/clients/add_client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/super-admin/${ts}/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/super-admin/${ts}/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "Training Center",
    submenu: [
      {
        label: "Training Sites",
        href: `/dashboard/super-admin/${ts}/training-center/training-sites`,
      },
      {
        label: "Training Site Rosters",
        href: `/dashboard/super-admin/${ts}/training-center/training-site-rosters`,
      },
      {
        label: "TC Products",
        href: `/dashboard/super-admin/${ts}/training-center/tc-products`,
      },
      {
        label: "TC Product Orders",
        href: `/dashboard/super-admin/${ts}/training-center/tc-product-orders`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/super-admin/${ts}/reports/activity_reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/super-admin/${ts}/reports/class_reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/super-admin/${ts}/reports/product_addon_report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/super-admin/${ts}/reports/promo_code_report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/super-admin/${ts}/reports/registration_report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/super-admin/${ts}/reports/event_log`,
      },
    ],
  },
  {
    label: "Credit Card Services",
    submenu: [
      {
        label: "Merchant Track",
        href: `/dashboard/super-admin/${ts}/credit_card_services/merchant_track`,
      },
      {
        label: "Payment Report",
        href: `/dashboard/super-admin/${ts}/credit_card_services/payment_report`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/super-admin/${ts}/settings/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/super-admin/${ts}/settings/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/super-admin/${ts}/settings/online-keycodes`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/super-admin/${ts}/settings/promo-codes`,
      },
      {
        label: "Locations",
        href: `/dashboard/super-admin/${ts}/settings/location`,
      },
      {
        label: "Certificates",
        href: `/dashboard/super-admin/${ts}/settings/certificates`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/super-admin/${ts}/settings/external-sku`,
      },
      {
        label: "Discipline",
        href: `/dashboard/super-admin/${ts}/settings/discipline`,
      },
      {
        label: "Course Certifying Body",
        href: `/dashboard/super-admin/${ts}/settings/certifying-body`,
      },
      { label: "Users", href: `/dashboard/super-admin/${ts}/settings/users` },
      { label: "Email Campaigns", href: `/dashboard/super-admin/${ts}/settings/email-campaigns` },
      {
        label: "Card Settings",
        href: `/dashboard/super-admin/${ts}/settings/cards-settings`,
      },
      {
        label: "Site Settings",
        href: `/dashboard/super-admin/${ts}/settings/site-settings`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Support Request",
        href: `/dashboard/super-admin/${ts}/help/support_request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/super-admin/${ts}/help/whats_new`,
      },
    ],
  },
];

const superAdminSiteMenu = (ts) => [
  {
    label: "Classes",
    submenu: [
      {
        label: "Classes",
        href: `/dashboard/super-admin/${ts}/class_and_students/classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/super-admin/${ts}/class_and_students/student_search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/super-admin/${ts}/clients/manage_clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/super-admin/${ts}/clients/add_client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/super-admin/${ts}/instructors/instructor-records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/super-admin/${ts}/instructors/add-instructor`,
      },
    ],
  },
  {
    label: "Training Site",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/super-admin/${ts}/training_center/training_site_rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/super-admin/${ts}/training_center/tc_products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/super-admin/${ts}/training_center/tc_product_orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/super-admin/${ts}/class_and_students/ts_product_orders`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/super-admin/${ts}/settings/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/super-admin/${ts}/settings/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/super-admin/${ts}/settings/online-keycodes`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/super-admin/${ts}/settings/promo-codes`,
      },
      {
        label: "Locations",
        href: `/dashboard/super-admin/${ts}/settings/location`,
      },
      {
        label: "Card Settings",
        href: `/dashboard/super-admin/${ts}/settings/cards-settings`,
      },
      {
        label: "Certificates",
        href: `/dashboard/super-admin/${ts}/settings/certificates`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/super-admin/${ts}/settings/external-sku`,
      },
      { label: "Users", href: `/dashboard/super-admin/${ts}/settings/users` },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/super-admin/${ts}/reports/activity_reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/super-admin/${ts}/reports/class_reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/super-admin/${ts}/reports/product_addon_report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/super-admin/${ts}/reports/promo_code_report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/super-admin/${ts}/reports/registration_report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/super-admin/${ts}/reports/event_log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "TS Support Request",
        href: `/dashboard/super-admin/${ts}/help/support_request`,
      },
      {
        label: "TC Support Request",
        href: `/dashboard/super-admin/${ts}/help/support_request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/super-admin/${ts}/help/whats_new`,
      },
    ],
  },
];

const adminMenu = (ts) => [
  {
    label: "Classes",
    submenu: [
      {
        label: "Classes",
        href: `/dashboard/admin/${ts}/class_and_students/classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/admin/${ts}/class_and_students/student_search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/admin/${ts}/clients/manage_clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/admin/${ts}/clients/add_client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/admin/${ts}/instructors/instructor_records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/admin/${ts}/instructors/add_instructor`,
      },
    ],
  },
  {
    label: "Training Site",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/admin/${ts}/training_center/training_site_rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/admin/${ts}/training_center/tc_products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/admin/${ts}/training_center/tc_product_orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/admin/${ts}/class_and_students/ts_product_orders`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/admin/${ts}/settings/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/admin/${ts}/settings/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/admin/${ts}/settings/online-keycodes`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/admin/${ts}/settings/promo-codes`,
      },
      {
        label: "Locations",
        href: `/dashboard/admin/${ts}/settings/location`,
      },
      {
        label: "Card Settings",
        href: `/dashboard/admin/${ts}/settings/cards-settings`,
      },
      {
        label: "Certificates",
        href: `/dashboard/admin/${ts}/settings/certificates`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/admin/${ts}/settings/external-sku`,
      },
      { label: "Users", href: `/dashboard/admin/${ts}/settings/users` },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/admin/${ts}/reports/activity_reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/admin/${ts}/reports/class_reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/admin/${ts}/reports/product_addon_report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/admin/${ts}/reports/promo_code_report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/admin/${ts}/reports/registration_report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/admin/${ts}/reports/event_log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "TS Support Request",
        href: `/dashboard/admin/${ts}/help/support_request`,
      },
      {
        label: "TC Support Request",
        href: `/dashboard/admin/${ts}/help/support_request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/admin/${ts}/help/whats_new`,
      },
    ],
  },
];

const instructorMenu = (ts) => [
  {
    label: "Classes",
    submenu: [
      {
        label: "Classes",
        href: `/dashboard/instructor/${ts}/class_and_students/classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/instructor/${ts}/class_and_students/student_search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/instructor/${ts}/clients/manage_clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/instructor/${ts}/clients/add_client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/instructor/${ts}/instructors/instructor_records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/instructor/${ts}/instructors/add_instructor`,
      },
    ],
  },
  {
    label: "Training Site",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/instructor/${ts}/training_center/training_site_rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/instructor/${ts}/training_center/tc_products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/instructor/${ts}/training_center/tc_product_orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/instructor/${ts}/class_and_students/ts_product_orders`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/instructor/${ts}/settings/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/instructor/${ts}/settings/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/instructor/${ts}/settings/online-keycodes`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/instructor/${ts}/settings/promo-codes`,
      },
      {
        label: "Locations",
        href: `/dashboard/instructor/${ts}/settings/location`,
      },
      {
        label: "Card Settings",
        href: `/dashboard/instructor/${ts}/settings/cards-settings`,
      },
      {
        label: "Certificates",
        href: `/dashboard/instructor/${ts}/settings/certificates`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/instructor/${ts}/settings/external-sku`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/instructor/${ts}/reports/activity_reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/instructor/${ts}/reports/class_reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/instructor/${ts}/reports/product_addon_report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/instructor/${ts}/reports/promo_code_report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/instructor/${ts}/reports/registration_report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/instructor/${ts}/reports/event_log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "TS Support Request",
        href: `/dashboard/instructor/${ts}/help/support_request`,
      },
      {
        label: "TC Support Request",
        href: `/dashboard/instructor/${ts}/help/support_request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/instructor/${ts}/help/whats_new`,
      },
    ],
  },
];

const assistantMenu = (ts) => [
  {
    label: "Classes",
    submenu: [
      {
        label: "Classes",
        href: `/dashboard/instructor-assistant/${ts}/class_and_students/classes`,
      },
      {
        label: "Student Search",
        href: `/dashboard/instructor-assistant/${ts}/class_and_students/student_search`,
      },
    ],
  },
  {
    label: "Clients",
    submenu: [
      {
        label: "Manage Clients",
        href: `/dashboard/instructor-assistant/${ts}/clients/manage_clients`,
      },
      {
        label: "Add Clients",
        href: `/dashboard/instructor-assistant/${ts}/clients/add_client`,
      },
    ],
  },
  {
    label: "Instructors",
    submenu: [
      {
        label: "Instructor Records",
        href: `/dashboard/instructor-assistant/${ts}/instructors/instructor_records`,
      },
      {
        label: "Add Instructor",
        href: `/dashboard/instructor-assistant/${ts}/instructors/add_instructor`,
      },
    ],
  },
  {
    label: "Training Site",
    submenu: [
      {
        label: "Training Site Rosters",
        href: `/dashboard/instructor-assistant/${ts}/training_center/training_site_rosters`,
      },
      {
        label: "TS Products",
        href: `/dashboard/instructor-assistant/${ts}/training_center/tc_products`,
      },
      {
        label: "TS Product Orders",
        href: `/dashboard/instructor-assistant/${ts}/training_center/tc_product_orders`,
      },
      {
        label: "Order TC Product",
        href: `/dashboard/instructor-assistant/${ts}/class_and_students/ts_product_orders`,
      },
    ],
  },
  {
    label: "Settings",
    submenu: [
      {
        label: "Course Type",
        href: `/dashboard/instructor-assistant/${ts}/settings/course-type`,
      },
      {
        label: "Product Add-ons",
        href: `/dashboard/instructor-assistant/${ts}/settings/product-add-ons`,
      },
      {
        label: "Online Keycodes",
        href: `/dashboard/instructor-assistant/${ts}/settings/online-keycodes`,
      },
      {
        label: "Promo Codes",
        href: `/dashboard/instructor-assistant/${ts}/settings/promo-codes`,
      },
      {
        label: "Locations",
        href: `/dashboard/instructor-assistant/${ts}/settings/location`,
      },
      {
        label: "Card Settings",
        href: `/dashboard/instructor-assistant/${ts}/settings/cards-settings`,
      },
      {
        label: "Certificates",
        href: `/dashboard/instructor-assistant/${ts}/settings/certificates`,
      },
      {
        label: "External SKUs",
        href: `/dashboard/instructor-assistant/${ts}/settings/external-sku`,
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Activity Reports",
        href: `/dashboard/instructor-assistant/${ts}/reports/activity_reports`,
      },
      {
        label: "Class Report",
        href: `/dashboard/instructor-assistant/${ts}/reports/class_reports`,
      },
      {
        label: "Product Add-on Report",
        href: `/dashboard/instructor-assistant/${ts}/reports/product_addon_report`,
      },
      {
        label: "Promo Code Report",
        href: `/dashboard/instructor-assistant/${ts}/reports/promo_code_report`,
      },
      {
        label: "Registration Report",
        href: `/dashboard/instructor-assistant/${ts}/reports/registration_report`,
      },
      {
        label: "Event Log",
        href: `/dashboard/instructor-assistant/${ts}/reports/event_log`,
      },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "TS Support Request",
        href: `/dashboard/instructor-assistant/${ts}/help/support_request`,
      },
      {
        label: "TC Support Request",
        href: `/dashboard/instructor-assistant/${ts}/help/support_request`,
      },
      {
        label: "Whats New",
        href: `/dashboard/instructor-assistant/${ts}/help/whats_new`,
      },
    ],
  },
];
