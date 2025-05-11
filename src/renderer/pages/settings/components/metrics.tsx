import { TabsContent } from "~/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import React from "react";
import { generalRegex, Settings } from "@/shared/settings";
import { Toast } from "~/components/Toast";
import SeachableSelectWithCreationLogic from "~/components/seachableSelectWithCreationLogic";

type Props = {
  newMetricName: string;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  settings: Settings;
  newMetricRegex: string;
  setNewMetricName: React.Dispatch<React.SetStateAction<string>>;
  setNewMetricRegex: React.Dispatch<React.SetStateAction<string>>;
    saveSettings(data?:Partial<Settings>): Promise<void>;
};
export default function MetricsTab({
  newMetricName,
  setSettings,
  settings,
  newMetricRegex,
  setNewMetricName,
  setNewMetricRegex,
    saveSettings
}: Readonly<Props>) {
  // Add new metric
  const addMetric = async() => {
    if (!newMetricName.trim()) {
      Toast({
        message: "Metric name is required",
        variation: "error",
      });
      return;
    }

    if (!newMetricRegex.trim()) {
      Toast({
        message: "Regex pattern is required",
        variation: "error",
      });
      return;
    }
    await saveSettings({
      ...settings,
      metrics: {
        ...settings.metrics,
        [newMetricName]: newMetricRegex,
      },
    });
    // Reset form
    setNewMetricName("");
    setNewMetricRegex("");

  };

  // Remove metric
  const removeMetric = (name: string) => {
    const updatedMetrics = { ...settings.metrics };
    delete updatedMetrics[name];

    setSettings({
      ...settings,
      metrics: updatedMetrics,
    });
  };
  return (
    <TabsContent value="metrics">
      <Card>
        <CardHeader>
          <CardTitle>Metrics</CardTitle>
          <CardDescription>
            Configure metrics and their validation patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newMetricName">Metric Name</Label>
                  <Input
                    id="newMetricName"
                    placeholder="e.g. m, sec, kg"
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newMetricRegex">Validation Regex</Label>
                  <SeachableSelectWithCreationLogic
                    canCreate={false}
                    options={Object.keys(generalRegex).map(
                      (k: keyof typeof generalRegex) => {
                        return {
                          label: k,
                          value: k,
                        };
                      },
                    )}
                    onChange={(e) => setNewMetricRegex(e)}
                    value={newMetricRegex}
                  />
                </div>
              </div>

              <Button onClick={addMetric} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Current Metrics</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="grid gap-4">
                  {Object.entries(settings.metrics).map(([name, regex]) => {
                    return (
                      <div
                        key={name}
                        className="flex justify-between items-center p-2 rounded-md border"
                      >
                        <div>
                          <Badge variant="outline" className="mr-2">
                            {name}
                          </Badge>
                          <span className="text-sm font-mono">
                            {regex}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMetric(name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
