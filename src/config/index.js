// src/config/index.js
export const Roles = [
  {
    id: 1,
    name: "Super Admin",
  },
  {
    id: 2,
    name: "Admin",
  },
  {
    id: 3,
    name: "Instructor",
  },
  {
    id: 4,
    name: "Instructor Assistant",
  },
  {
    id: 5,
    name: "Student",
  },
  {
    id: 6,
    name: "Client",
  },
];

export const roleDefaultPage = {
  "Super Admin": "class-and-students/upcoming-classes",
  Admin: "class-and-students/classes",
  Instructor: "class-and-students/classes",
  "Instructor Assistant": "class-and-students/classes",
  Student: "classes/upcoming-classes",
  Client: "class-and-students/upcoming-classes",
};

export const roleSegment = {
  "Super Admin": "super-admin",
  Admin: "admin",
  Instructor: "instructor",
  "Instructor Assistant": "instructor-assistant",
  Student: "student",
  Client: "client",
};
