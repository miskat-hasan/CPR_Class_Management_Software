// src/components/enroll/EnrollSidebar.jsx
const EnrollSidebar = ({ siteSettings }) => {
  const basic = siteSettings?.basic_setting;
  const reg = siteSettings?.registration_settings;

  return (
    <div className="flex flex-col gap-4">
      {/* Secure Site */}
      <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
            Secure Site
          </h3>
        </div>
        <div className="px-4 py-3 flex gap-3 items-start">
          <img
            src="https://codeblueservices.enrollware.com/reg/img/lock.png"
            alt="Secure"
            className="size-10 shrink-0 mt-0.5"
          />
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            Please be assured that your information is protected and secure. We
            value your privacy and do not provide customer information to any
            third parties.
          </p>
        </div>
      </div>

      {/* Contact Us */}
      {basic && (
        <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-2 border-b border-gray-200 dark:border-zinc-700">
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white">
              Contact Us
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-col gap-0.5 text-sm">
            {basic.company_name && (
              <p className="font-semibold text-gray-900 dark:text-white">
                {basic.company_name}
              </p>
            )}
            {basic.tag_line && (
              <p className="font-semibold text-gray-700 dark:text-zinc-300">
                {basic.tag_line}
              </p>
            )}
            <div className="text-gray-600 dark:text-zinc-400 mt-1 text-xs leading-5">
              {basic.address_1 && <p>{basic.address_1}</p>}
              {basic.address_2 && <p>{basic.address_2}</p>}
              {(basic.city || basic.state || basic.zip_code) && (
                <p>
                  {[basic.city, basic.state, basic.zip_code]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {basic.phone && <p className="mt-1">{basic.phone}</p>}
              {basic.email_address && (
                <a
                  href={`mailto:${basic.email_address}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {basic.email_address}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Sidebar HTML */}
      {reg?.custom_sidebar_html && (
        <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm px-4 py-3">
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed
              [&_ol]:list-decimal [&_ol]:pl-5
              [&_li[data-list=bullet]]:list-disc [&_li[data-list=bullet]]:ml-6"
            dangerouslySetInnerHTML={{
              __html: reg.custom_sidebar_html
                ?.replace(/background-color:\s*rgb\(255,\s*255,\s*255\);?/g, "")
                ?.replace(/color:\s*rgb\(28,\s*27,\s*31\);?/g, ""),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EnrollSidebar;
