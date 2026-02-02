import GymDetailView from "@/components/gyms/GymDetailView";

export default async function GymPage({ params }: { params: Promise<{ gymId: string }> }) {
  const { gymId } = await params;
  return <GymDetailView gymId={gymId} />;
}