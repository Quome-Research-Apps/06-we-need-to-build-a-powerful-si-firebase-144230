"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Header } from "@/components/dashboard/header";
import { Overview } from "@/components/dashboard/overview";
import { TimeSeriesView } from "@/components/dashboard/time-series-view";
import { CorrelationView } from "@/components/dashboard/correlation-view";
import { CohortView } from "@/components/dashboard/cohort-view";

const viewComponents: Record<string, React.ComponentType> = {
  overview: Overview,
  "time-series": TimeSeriesView,
  correlation: CorrelationView,
  cohorts: CohortView,
};

const viewTitles: Record<string, string> = {
  overview: "Overview",
  "time-series": "Time Series Analysis",
  correlation: "Correlation Analysis",
  cohorts: "Cohort Analysis",
};

export function DashboardClient() {
  const [activeView, setActiveView] = useState("overview");

  const ActiveViewComponent = viewComponents[activeView] || Overview;
  const title = viewTitles[activeView] || "Dashboard";

  return (
    <DashboardLayout>
      <SidebarNav activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <ActiveViewComponent />
        </main>
      </div>
    </DashboardLayout>
  );
}
