import SectionTitle from "../common/SectionTitle";

const ProfileSkeleton = () => {
  const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-md ${className}`} />
  );
  
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 space-y-4">
        <SectionTitle title="General Information" className="mb-3" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
        </div>

        <div className="flex justify-end mt-4">
          <SkeletonBox className="h-10 w-32" />
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-[14px] p-4 lg:p-8 space-y-4">
        <SectionTitle title="Password Change" className="mb-3" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <SkeletonBox className="h-10 lg:h-14 col-span-1" />
          <div className="col-span-full flex justify-end mt-4">
            <SkeletonBox className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSkeleton;