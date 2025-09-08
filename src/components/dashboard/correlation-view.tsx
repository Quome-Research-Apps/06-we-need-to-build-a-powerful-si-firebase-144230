import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppWindow } from "lucide-react";

export function CorrelationView() {
  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppWindow />
            Correlation Analysis
          </CardTitle>
          <CardDescription>
            Calculate and visualize correlations between adherence patterns and other variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M16.5 7.5l-9 9"/><path d="m7.5 7.5 9 9"/></svg>
            <h3 className="text-lg font-semibold">Correlation Matrix Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This feature will display a correlation matrix and scatter plots to help you identify relationships between different variables in your dataset.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
