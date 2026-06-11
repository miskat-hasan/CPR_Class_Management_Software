"use client";
import SectionTitle from "@/components/common/SectionTitle";
import { XCircle } from "lucide-react";
import Link from "next/link";

const firstAidCampaign = {
  type: "first-aid-cpr",
  title: "First Aid/CPR/AED Instructor Course Requirements",
  status: "active",
  emails: [
    { day: "7", subject: "Pre-Work (Online Course) and Instructor Toolkit" },
    { day: "2", subject: "Pre-Work Not Completed" },
    { day: "1", subject: "Class Reminder" },
    {
      day: "1",
      subject: "Class Reminder (No Pre-Work) Also available for Blg Courses",
    },
    {
      day: "1",
      subject:
        "Post Class: Certification Info (Also available in Blended/Big Courses)",
    },
    { day: "1", subject: "Failed Instructor Course - RECERTIFICATION EMAILS" },
  ],
};

const followUpCampaign = {
  type: "follow-up-email",
  title: "Follow up Email",
  status: "inactive",
  emails: [
    {
      day: "1",
      subject:
        "Renew Your Appointment with Coastline CPR/Coastline Health Services, LLC",
    },
    {
      day: "1",
      subject:
        "Thanks for taking the course with Coastline CPR/Coastline Health Services, LLC",
    },
  ],
};

const twoYearFollowUpCampaign = {
  type: "2-year-follow-up",
  title: "Its been 2 Years Follow Up Email",
  status: "active",
  emails: [
    { day: "365", subject: "Time to Renew your CPR Certification" },
    { day: "456", subject: "Renew Your Certification" },
    { day: "600", subject: "Renew Your Certification" },
    { day: "730", subject: "It's time to renew your CPR Certification!" },
  ],
};

const redcrossBlendedCampaign = {
  type: "redcross-blended",
  title: "Redcross blended online courses",
  status: "active",
  emails: [
    { day: "7", subject: "REMINDER ON YOUR UPCOMING COURSE (Company)" },
    { day: "2", subject: "REMINDER ON YOUR UPCOMING COURSE (Company)" },
    { day: "1", subject: "REMINDER ON YOUR UPCOMING COURSE" },
  ],
};

const renewAhaCampaign = {
  type: "renew-aha",
  title: "RENEW YOUR AHA CERTIFICATION",
  status: "inactive",
  emails: [
    { day: "365", subject: "Cert Final: Renew Your AHA Certification" },
    { day: "456", subject: "Cert Final: Renew Your AHA Certification" },
    { day: "600", subject: "Cert Final: Renew Your AHA Certification" },
    { day: "730", subject: "Cert Final: Renew Your AHA Certification" },
  ],
};

const renewArcCampaign = {
  type: "renew-arc",
  title: "RENEW YOUR ARC CERTIFICATION",
  status: "active",
  emails: [
    {
      day: "365",
      subject:
        "Cert Final: Renew Your ARC Certification - (Course) & (Location) Custom Audiences",
    },
    {
      day: "600",
      subject:
        "Cert Final: Renew Your ARC Certification - (Course) & (Location) Custom Audiences",
    },
    {
      day: "730",
      subject:
        "Cert Final: Renew Your ARC Certification - (Course) & (Location) Custom Audiences",
    },
  ],
};

const ahaScheduledCampaign = {
  type: "aha-scheduled",
  title: "YOUR AHA CPR CLASS IS SCHEDULED",
  status: "active",
  emails: [{ day: "1", subject: "Your Upcoming Scheduled AHA Course details" }],
};

const arcScheduledCampaign = {
  type: "arc-scheduled",
  title: "YOUR ARC CPR CLASS IS SCHEDULED",
  status: "active",
  emails: [
    {
      day: "1",
      subject: "Reminder: Your ARC Upcoming Course details",
      special: true,
    },
  ],
};

// --- Main campaigns array ---
// This array now just lists all the campaign objects you defined above.
// The .map() loop will work exactly the same way.
const campaigns = [
  firstAidCampaign,
  followUpCampaign,
  twoYearFollowUpCampaign,
  redcrossBlendedCampaign,
  renewAhaCampaign,
  renewArcCampaign,
  ahaScheduledCampaign,
  arcScheduledCampaign,
];

// --- Main Page Component ---
// This part does not need to change at all.
export default function EmailCampaignsPage() {
  return (
    <div className="min-h-screen bg-gray-100  ">
      {/* Page Header */}
      <div className="mb-3 lg:mb-6 flex flex-row justify-between gap-4">
        <SectionTitle title={"Email Campaigns"} />
        <Link
          href={`/admin/settings/emails_campaigns/add_new_campaign`}
          className="rounded-md bg-brown dark:bg-dark-brown px-4 py-2 text-[10px] lg:text-sm font-medium text-white shadow-sm hover:bg-brown dark:bg-dark-brown focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2"
        >
          New Campaign
        </Link>
      </div>

      {/* Campaign List */}
      <div className="space-y-3 lg:space-y-6">
        {campaigns.map((campaign, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white dark:bg-black ">
            {/* Card Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {campaign.title}
                {campaign.status === "inactive" && (
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    (Inactive)
                  </span>
                )}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/settings/emails_campaigns/${campaign.type}/edit_email_campaign`}
                  className="rounded-md bg-brown dark:bg-dark-brown px-4 py-2 text-[10px] lg:text-sm font-medium text-white shadow-sm hover:bg-brown dark:bg-dark-brown focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2"
                >
                  Edit Campaign
                </Link>
                <Link
                  href={`/admin/settings/emails_campaigns/${campaign.type}/add_new_email`}
                  className="rounded-md bg-brown dark:bg-dark-brown px-4 py-2 text-[10px] lg:text-sm font-medium text-white shadow-sm hover:bg-brown dark:bg-dark-brown focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2"
                >
                  Add New Email
                </Link>
              </div>
            </div>

            {/* Card Body (Email List) */}
            <div className="px-2 md:px-6 py-4">
              {/* Table Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-2 text-xs font-semibold text-gray-500">
                <div className="col-span-2">Day to Send</div>
                <div className="col-span-8">Subject Line</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Email Rows */}
              <div className="space-y-3">
                {campaign.emails.map((email, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 items-center gap-2 md:gap-4 rounded-md bg-gray-50 p-3 md:p-3"
                  >
                    {/* Day */}
                    <div className="col-span-2 text-sm text-gray-700 md:text-left">
                      {email.day}
                    </div>

                    {/* Subject */}
                    <div className="col-span-8 text-sm text-gray-900 flex items-center">
                      {email.special && (
                        <span className="mr-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></span>
                      )}
                      {email.subject}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end md:justify-end">
                      <button className="text-gray-400 hover:text-red-600">
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
