"use client";

import { useDataStore } from "@/hooks/use-data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowDown, ArrowUp, CalendarDays, Sigma, Users } from "lucide-react";
import { AnonymizationReport } from "./anonymization-report";

export function Overview() {
  const { data } = useDataStore();

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground flex items-center gap-2">
            <AlertCircle /> No data loaded. Please import data first.
        </p>
      </div>
    );
  }

  const recordCount = data.length;
  const uniquePatients = new Set(data.map(d => d.patientId)).size;
  const adherenceRates = data.map(d => d.adherenceRate);
  const avgAdherence = adherenceRates.reduce((a, b) => a + b, 0) / adherenceRates.length;
  const maxAdherence = Math.max(...adherenceRates);
  const minAdherence = Math.min(...adherenceRates);
  const timestamps = data.map(d => d.timestamp * 1000);
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps));

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{recordCount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Across {uniquePatients.toLocaleString()} unique patients
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Adherence</CardTitle>
                    <Sigma className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(avgAdherence * 100).toFixed(1)}%</div>
                     <p className="text-xs text-muted-foreground">
                        From {(minAdherence * 100).toFixed(1)}% to {(maxAdherence * 100).toFixed(1)}%
                    </p>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold">
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Duration of the study period
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <AnonymizationReport />
        </div>
    </div>
  );
}
