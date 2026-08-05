// src/components/enroll/StepReviewPayment.jsx
"use client";

const fmt = val => parseFloat(val ?? 0).toFixed(2);

const ReviewTable = ({ children }) => (
  <div className="border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm mb-5">
    <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2.5 border-b border-gray-200 dark:border-zinc-700">
      <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
        Please Review and Confirm
      </h3>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-zinc-700">
      {children}
    </div>
  </div>
);

const ReviewRow = ({ label, children }) => (
  <div className="grid grid-cols-3">
    <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 font-semibold text-sm text-gray-700 dark:text-zinc-300 border-r border-gray-200 dark:border-zinc-700">
      {label}
    </div>
    <div className="col-span-2 px-4 py-3 text-sm text-gray-800 dark:text-zinc-200">
      {children}
    </div>
  </div>
);

// Main Component
const StepReviewPayment = ({
  form,
  classDetails,
  addonsList,
  registrationQuestions,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const values = form.getValues();
  const course = classDetails?.course;
  const location = classDetails?.location;

  // Selected add-ons
  const selectedAddons = addonsList.filter(
    a => values.addons?.[a.id] === "yes",
  );

  // Calculate total
  const basePrice = parseFloat(classDetails?.price ?? 0);
  const addonTotal = selectedAddons.reduce(
    (sum, a) => sum + parseFloat(a.price ?? 0),
    0,
  );
  const rescheduleInsurance =
    values.reschedule_insurance === "yes"
      ? parseFloat(course?.reschedule_insurance_price ?? 0)
      : 0;
  const total = basePrice + addonTotal + rescheduleInsurance;

  // Question answer display
  const getAnswerDisplay = q => {
    const answer = values.reg_questions?.[q.id];
    if (!answer) return "—";
    if (answer instanceof File) return answer.name;
    if (Array.isArray(answer)) return answer.join(", ");
    return String(answer);
  };

  const handleValid = data => {
    onSubmit({ ...values, ...data });
  };

  const mailingAddress = [
    values.address_1,
    values.address_2,
    values.city,
    values.state,
    values.zip_code,
  ]
    .filter(Boolean)
    .join(", ");

  const locationAddress = [
    location?.address_1,
    location?.address_2,
    location?.city,
    location?.state,
    location?.zip,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <form onSubmit={form.handleSubmit(handleValid)}>
      <p className="text-sm text-gray-700 dark:text-zinc-300 mb-4">
        <strong>Your registration is almost complete.</strong> Please review the
        information below for accuracy. If changes are required, click the{" "}
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-blue-600 dark:text-blue-400 underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Make Changes
        </button>{" "}
        button, otherwise <strong>click "Pay Now"</strong> to continue to secure
        payment.
      </p>

      {/* Review Table */}
      <ReviewTable>
        <ReviewRow label="Course:">{course?.course_name}</ReviewRow>
        <ReviewRow label="Date/Time:">
          <div className="flex flex-col gap-0.5">
            {classDetails?.class_times?.map((t, i) => (
              <span key={i} className="text-blue-600 dark:text-blue-400">
                {t.date} from {t.from} to {t.to}
              </span>
            ))}
          </div>
        </ReviewRow>
        <ReviewRow label="Location:">
          <span className="text-blue-600 dark:text-blue-400">
            {locationAddress || "—"}
          </span>
        </ReviewRow>

        {/* Selected add-ons */}
        {selectedAddons.length > 0 && (
          <ReviewRow label="Add-ons:">
            <div className="flex flex-col gap-0.5">
              {selectedAddons.map(a => (
                <span key={a.id}>
                  {a.name} — ${fmt(a.price)}
                </span>
              ))}
            </div>
          </ReviewRow>
        )}

        {/* Reschedule insurance */}
        {values.reschedule_insurance === "yes" && (
          <ReviewRow label="Reschedule Insurance:">
            ${fmt(course?.reschedule_insurance_price)}
          </ReviewRow>
        )}

        <ReviewRow label="Current Charge:">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            ${fmt(total)}
          </span>
        </ReviewRow>

        {/* Empty separator row like the screenshot */}
        <div className="h-2 bg-gray-50 dark:bg-zinc-900" />

        <ReviewRow label="Name:">
          {values.first_name} {values.last_name}
        </ReviewRow>
        <ReviewRow label="Email Address:">{values.email_address}</ReviewRow>
        <ReviewRow label="Phone:">
          {[values.mobile_phone, values.alternate_phone]
            .filter(Boolean)
            .join(" or ")}
        </ReviewRow>
        <ReviewRow label="Mailing Address:">{mailingAddress || "—"}</ReviewRow>

        {/* Registration question answers */}
        {registrationQuestions.map(q => (
          <ReviewRow key={q.id} label={`${q.question}:`}>
            {getAnswerDisplay(q)}
          </ReviewRow>
        ))}

        {values.comments && (
          <ReviewRow label="Comments:">{values.comments}</ReviewRow>
        )}

        <ReviewRow label="Payment Method:">Credit Card</ReviewRow>
      </ReviewTable>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Make Changes
        </button>
        <span className="text-sm text-gray-500 dark:text-zinc-400">or</span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-md transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Redirecting to Payment…" : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

export default StepReviewPayment;
