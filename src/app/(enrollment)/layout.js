// src/app/enroll/layout.js
const EnrollmentLayout = ({ children }) => {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="p-5 max-w-[1400px] mx-auto">{children}</div>
    </div>
  );
};

export default EnrollmentLayout;
