import DesignConfigurator from "./DesignConfigurator";
import { db } from "@/db";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { id: string | undefined };
}) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const config = await db.configuration.findUnique({
    where: { id },
  });

  if (!config) {
    return notFound();
  }

  const { url, width, height } = config;

  return (
    <DesignConfigurator
      configId={id}
      url={url}
      dimensions={{ width, height }}
    />
  );
};

export default page;
