"use client";

import React, { useState, useMemo } from "react";
import { useDataStore } from "@/hooks/use-data-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Wand2, BarChart2, Lightbulb, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { addDays, format, fromUnixTime, getUnixTime } from "date-fns";
import {
  suggestRelevantAnalysis,
  type SuggestRelevantAnalysisOutput,
} from "@/ai/flows/suggest-relevant-analysis";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const chartConfig = {
  adherenceRate: {
    label: "Adherence",
    color: "hsl(var(--primary))",
  },
};

export function TimeSeriesView() {
  const { data } = useDataStore();
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (!data) return undefined;
    const timestamps = data.map((d) => d.timestamp * 1000);
    const minDate = new Date(Math.min(...timestamps));
    return { from: minDate, to: addDays(minDate, 30) };
  });

  const [aiSuggestions, setAiSuggestions] = useState<SuggestRelevantAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data
      .map((d) => ({
        date: fromUnixTime(d.timestamp),
        adherenceRate: d.adherenceRate * 100,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [data]);

  const handleSuggestAnalysis = async () => {
    if (!data || !date?.from || !date?.to) return;

    setIsLoading(true);
    setAiSuggestions(null);

    const startTime = getUnixTime(date.from);
    const endTime = getUnixTime(date.to);

    const timeSeriesData = data
      .filter((d) => d.timestamp >= startTime && d.timestamp <= endTime)
      .map(({ timestamp, adherenceRate, ...rest }) => ({
        timestamp,
        adherenceRate,
        otherVariables: rest,
      }));

    try {
      const result = await suggestRelevantAnalysis({
        timeSeriesData,
        startTime,
        endTime,
        additionalContext: "Analyzing medication adherence for clinical research.",
      });
      setAiSuggestions(result);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground flex items-center gap-2">
            <AlertCircle /> No data loaded. Please import data first.
        </p>
      </div>
    );
  }


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart2/>
                Adherence Rate Over Time
            </CardTitle>
            <CardDescription>
                Visualize the adherence rate across the entire study period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(value, "MMM d")}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${(value as number).toFixed(1)}%`}
                      indicator="dot"
                    />
                  }
                />
                <Line
                  dataKey="adherenceRate"
                  type="monotone"
                  stroke={chartConfig.adherenceRate.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wand2 className="text-primary"/>
                AI-Powered Analysis
            </CardTitle>
            <CardDescription>
              Select a date range to get AI-driven insights and analysis suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {aiSuggestions && (
              <Accordion type="single" collapsible className="w-full">
                {aiSuggestions.suggestedAnalyses.map((suggestion, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-400" />
                        {suggestion.analysisType}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <p><strong>Description:</strong> {suggestion.description}</p>
                      <p><strong>Rationale:</strong> {suggestion.rationale}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

          </CardContent>
          <CardFooter>
             <Button onClick={handleSuggestAnalysis} disabled={isLoading || !date?.from || !date.to} className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Analyzing..." : "Suggest Analysis"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
