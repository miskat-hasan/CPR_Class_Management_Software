function SidebarSkeleton() {
  return (
    <div className="max-w-[250px] xl:max-w-[300px] 2xl:max-w-[345px] w-full px-[17px] pt-[22.5px] h-screen bg-white dark:bg-black hidden xl:flex xl:flex-col gap-[31.5px] dark:border-r dark:border-neutral-700">
      {/* Logo skeleton */}
      <div className="flex items-center gap-1.5 justify-center">
        <div className="h-8 w-8 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Select skeleton */}
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-700 animate-pulse" />

        {/* Dashboard label skeleton */}
        <div className="h-10 w-full rounded bg-gray-100 dark:bg-neutral-700/60 animate-pulse" />

        {/* Menu item skeletons */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-11 w-full rounded-[10px] bg-gray-100 dark:bg-neutral-700/60 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default SidebarSkeleton;