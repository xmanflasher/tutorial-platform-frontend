import React from "react";

// 這裡不需要 fetch 資料了，因為 Header 已經交給 page.tsx 處理
export default function UserPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ★★★ 這裡放入你指定的那些 Layout Class ★★★
    <div className="flex min-h-svh flex-1 flex-col bg-[#0d0e11] peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow ui-main-layout overflow-y-auto relative text-foreground">

      {/* 這裡直接渲染 page.tsx 的內容 */}
      <main className="w-full">
        {children}
      </main>

    </div>
  );
}