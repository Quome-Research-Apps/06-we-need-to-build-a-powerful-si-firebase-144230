"use client";

import { useDataStore } from "@/hooks/use-data-store";
import { DataImporter } from "@/components/dashboard/data-importer";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function Home() {
  const { data } = useDataStore();

  if (!data) {
    return <DataImporter />;
  }

  return <DashboardClient />;
}
