"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function AnonymizationReport() {
  const kAnonymity = 5;
  const lDiversity = 3;
  const tCloseness = 0.2;

  const getKAnonymityStatus = (k: number) => {
    if (k >= 5) return { label: "Strong", color: "bg-green-500" };
    if (k >= 3) return { label: "Moderate", color: "bg-yellow-500" };
    return { label: "Weak", color: "bg-red-500" };
  };

  const getLDiversityStatus = (l: number) => {
    if (l >= 3) return { label: "Good", color: "bg-green-500" };
    if (l >= 2) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Poor", color: "bg-red-500" };
  };
  
  const anonymizationScore = Math.min(100, (kAnonymity / 10) * 50 + (lDiversity / 5) * 40 + (1-tCloseness)*10);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="text-primary" />
          Anonymization Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
          <div>
            <p className="text-sm text-muted-foreground">Overall Privacy Score</p>
            <p className="text-2xl font-bold">{Math.round(anonymizationScore)}/100</p>
          </div>
          <div className="flex items-center gap-2">
            {anonymizationScore > 80 ? (
              <>
                <ShieldCheck className="h-6 w-6 text-green-500" />
                <span className="font-semibold text-green-500">Excellent</span>
              </>
            ) : (
               <>
                <ShieldAlert className="h-6 w-6 text-yellow-500" />
                <span className="font-semibold text-yellow-500">Good</span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">k-Anonymity</h4>
                    <Badge variant="outline" className={getKAnonymityStatus(kAnonymity).color + " text-white"}>
                        {kAnonymity} ({getKAnonymityStatus(kAnonymity).label})
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Ensures each record is indistinguishable from at least k-1 other records. Higher is better.</p>
                <Progress value={(kAnonymity/10)*100} className="mt-2 h-2" />
            </div>
             <div>
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">l-Diversity</h4>
                    <Badge variant="outline" className={getLDiversityStatus(lDiversity).color + " text-white"}>
                       {lDiversity} ({getLDiversityStatus(lDiversity).label})
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Ensures at least 'l' well-represented sensitive values for each group. Higher is better.</p>
                <Progress value={(lDiversity/5)*100} className="mt-2 h-2" />
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">t-Closeness</h4>
                     <Badge variant="outline" className="bg-green-500 text-white">
                        {tCloseness} (Good)
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Ensures distribution of sensitive attributes is close to their overall distribution. Lower is better.</p>
                <Progress value={(1-tCloseness)*100} className="mt-2 h-2" />
            </div>
        </div>
        <div className="text-xs text-muted-foreground p-3 rounded-md border border-dashed text-center">
            This is a simulated report. The tool ensures privacy by processing all data locally. No data is ever sent to a server.
        </div>
      </CardContent>
    </Card>
  );
}
