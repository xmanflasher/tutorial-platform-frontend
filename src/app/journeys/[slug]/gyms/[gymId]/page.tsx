import GymDetailView from "@/components/gyms/GymDetailView";
import { gymService } from "@/services";
import { notFound } from "next/navigation";

export default async function GymPage({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = await params;

  // 在 Server 端直接抓資料
  const gymData = await gymService.getGymDetail(gymId);

  // 如果沒資料，直接觸發 Next.js 的 404 頁面
  if (!gymData) {
    notFound();
  }

  // 將資料封裝好丟給 Client Component
  return <GymDetailView gymData={gymData} />;
}