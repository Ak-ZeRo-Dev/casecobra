import DesignPreview from "@/components/DesignPreview";
import { db } from "@/db";
import { notFound } from "next/navigation";

const page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") notFound();

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) notFound();

  return <DesignPreview configuration={configuration} />;
};

export default page;
