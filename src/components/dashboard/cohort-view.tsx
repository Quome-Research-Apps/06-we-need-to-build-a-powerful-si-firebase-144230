import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users } from "lucide-react";

export function CohortView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users />
            Cohort Analysis
          </CardTitle>
          <CardDescription>
            Segment the population to compare adherence patterns in specific groups of interest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
            <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Cohort Analysis Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature will allow you to define and compare cohorts based on demographic data, adherence rates, or other variables to uncover group-specific trends.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
