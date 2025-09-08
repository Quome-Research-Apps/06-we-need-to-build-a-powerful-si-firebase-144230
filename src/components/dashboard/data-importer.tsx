"use client";

import { useState } from "react";
import { useDataStore } from "@/hooks/use-data-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AdherenceRecord } from "@/types";
import { FileUp, FileWarning, ActivitySquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DataImporter() {
  const { setData } = useDataStore();
  const [csvText, setCsvText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsLoading(true);
    if (!csvText.trim()) {
      toast({
        variant: "destructive",
        title: "No Data Provided",
        description: "Please paste your CSV data into the text area.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error("CSV must have a header and at least one data row.");
      }

      const header = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ["timestamp", "adherenceRate"];
      for (const req of requiredHeaders) {
        if (!header.includes(req)) {
          throw new Error(`CSV header is missing required column: ${req}`);
        }
      }

      const parsedData: AdherenceRecord[] = lines.slice(1).map((line, index) => {
        const values = line.split(',');
        const record: AdherenceRecord = { timestamp: 0, adherenceRate: 0 };

        header.forEach((h, i) => {
          const value = values[i] ? values[i].trim() : '';
          if (h === 'timestamp' || h === 'adherenceRate') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
              throw new Error(`Invalid number format in row ${index + 2}, column '${h}'.`);
            }
            record[h] = numValue;
          } else {
            record[h] = value;
          }
        });

        return record;
      });

      setData(parsedData);
      toast({
        title: "Data Imported Successfully",
        description: `${parsedData.length} records have been loaded.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Parse CSV Data",
        description: error.message,
      });
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <ActivitySquare className="h-10 w-10 text-primary"/>
                <div>
                  <CardTitle className="text-2xl font-bold">Adherence Insights Explorer</CardTitle>
                  <CardDescription>A powerful, session-based analytics tool for researchers.</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
             <FileWarning className="h-4 w-4" />
             <AlertTitle>Important: Data Privacy</AlertTitle>
             <AlertDescription>
                This tool runs entirely in your browser. Your data is <strong>never</strong> uploaded to any server and will be erased when you close this tab.
             </AlertDescription>
           </Alert>
          <div>
            <label htmlFor="csv-input" className="font-medium">Paste your CSV data here</label>
            <Textarea
              id="csv-input"
              className="mt-2 h-60 font-mono text-xs"
              placeholder="timestamp,adherenceRate,patientId,..."
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-secondary rounded-md">
            <strong>Required format:</strong> A CSV with at least `timestamp` (Unix timestamp in seconds) and `adherenceRate` (a number from 0 to 1) columns. Additional columns are supported.
            <br />
            Example: `timestamp,adherenceRate,patientId`
            <br/>
            `1672531200,0.85,P001`
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
            <FileUp className="mr-2 h-4 w-4" />
            {isLoading ? "Analyzing..." : "Load and Analyze Data"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
