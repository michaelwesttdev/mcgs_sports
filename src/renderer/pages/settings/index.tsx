"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { Plus, Trash2, Save } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Toast } from "~/components/Toast";
import { Settings } from "@/shared/settings";
import { useSettings } from "~/hooks/use_settings";
import MetricsTab from "~/pages/settings/components/metrics";

// Default settings

export default function SettingsPage() {
  // Age Groups
  const [newAgeGroupName, setNewAgeGroupName] = useState("");
  const [newAgeGroupMin, setNewAgeGroupMin] = useState("");
  const [newAgeGroupMax, setNewAgeGroupMax] = useState("");
  const [isRangeAgeGroup, setIsRangeAgeGroup] = useState(true);

  // Metrics
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricRegex, setNewMetricRegex] = useState("");

  // Points
  const [newPointPlace, setNewPointPlace] = useState("");
  const [newPointValue, setNewPointValue] = useState("");
  const [pointsType, setPointsType] = useState<"individual" | "team">(
    "individual",
  );
  const { settings: defaultSettings, updateSettings } = useSettings();
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Add new age group
  const addAgeGroup = () => {
    if (!newAgeGroupName.trim()) {
      Toast({
        message: "Age group name is required",
        variation: "error",
      });
      return;
    }

    const minAge = Number.parseInt(newAgeGroupMin);
    if (isNaN(minAge)) {
      Toast({
        message: "Minimum age must be a valid number",
        variation: "error",
      });
      return;
    }

    let ageValue: number | [number, number] = minAge;

    if (isRangeAgeGroup) {
      const maxAge = Number.parseInt(newAgeGroupMax);
      if (isNaN(maxAge)) {
        Toast({
          message: "Maximum age must be a valid number",
          variation: "error",
        });
        return;
      }

      if (maxAge < minAge) {
        Toast({
          message: "Maximum age must be greater than or equal to minimum age",
          variation: "error",
        });
        return;
      }

      ageValue = [minAge, maxAge];
    }

    setSettings({
      ...settings,
      ageGroups: {
        ...settings.ageGroups,
        [newAgeGroupName]: ageValue,
      },
    });

    // Reset form
    setNewAgeGroupName("");
    setNewAgeGroupMin("");
    setNewAgeGroupMax("");
  };

  // Remove age group
  const removeAgeGroup = (name: string) => {
    const updatedAgeGroups = { ...settings.ageGroups };
    delete updatedAgeGroups[name];

    setSettings({
      ...settings,
      ageGroups: updatedAgeGroups,
    });
  };

  // Add new point allocation
  const addPointAllocation = () => {
    const place = Number.parseInt(newPointPlace);
    const points = Number.parseInt(newPointValue);

    if (isNaN(place) || place <= 0) {
      Toast({
        message: "Place must be a positive number",
        variation: "error",
      });
      return;
    }

    if (isNaN(points) || points < 0) {
      Toast({
        message: "Points must be a non-negative number",
        variation: "error",
      });
      return;
    }

    const updatedPoints = {
      ...settings.points,
      [pointsType]: {
        ...settings.points[pointsType],
        [place]: points,
      },
    };

    setSettings({
      ...settings,
      points: updatedPoints,
    });

    // Reset form
    setNewPointPlace("");
    setNewPointValue("");
  };

  // Remove point allocation
  const removePointAllocation = (
    type: "individual" | "team",
    place: number,
  ) => {
    const updatedPointsType = { ...settings.points[type] };
    delete updatedPointsType[place];

    setSettings({
      ...settings,
      points: {
        ...settings.points,
        [type]: updatedPointsType,
      },
    });
  };

  // Save all settings
  const saveSettings = async (data?:Partial<Settings>) => {
    // In a real application, you would save to a database or API
    console.log("Saving settings:");
    await updateSettings(data??settings);
    setSettings((data??settings) as Settings);
    Toast({
      message: "Settings saved",
      variation: "success",
    });
  };

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Competition Settings</h1>
        <Button onClick={async()=>saveSettings()}>
          <Save className="mr-2 h-4 w-4" />
          Save All Settings
        </Button>
      </div>

      <Tabs defaultValue="ageGroups" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ageGroups">Age Groups</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
        </TabsList>

        {/* Age Groups Tab */}
        <TabsContent value="ageGroups">
          <Card>
            <CardHeader>
              <CardTitle>Age Groups</CardTitle>
              <CardDescription>
                Configure age groups for competition categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newAgeGroupName">Group Name</Label>
                      <Input
                        id="newAgeGroupName"
                        placeholder="e.g. U14, Senior"
                        value={newAgeGroupName}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.trim() && !/\d$/.test(value)) {
                            setIsRangeAgeGroup(false);
                          } else {
                            setIsRangeAgeGroup(true);
                          }
                          setNewAgeGroupName(e.target.value);
                        }}
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-8">
                      <input
                        type="checkbox"
                        id="isRangeAgeGroup"
                        checked={isRangeAgeGroup}
                        onChange={() => setIsRangeAgeGroup(!isRangeAgeGroup)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isRangeAgeGroup">Age Range</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isRangeAgeGroup ? (
                      <>
                        <div>
                          <Label htmlFor="newAgeGroupMin">Minimum Age</Label>
                          <Input
                            id="newAgeGroupMin"
                            type="number"
                            placeholder="e.g. 12"
                            value={newAgeGroupMin}
                            onChange={(e) => setNewAgeGroupMin(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newAgeGroupMax">Maximum Age</Label>
                          <Input
                            id="newAgeGroupMax"
                            type="number"
                            placeholder="e.g. 13"
                            value={newAgeGroupMax}
                            onChange={(e) => setNewAgeGroupMax(e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <Label htmlFor="newAgeGroupMin">Minimum Age</Label>
                        <Input
                          id="newAgeGroupMin"
                          type="number"
                          placeholder="e.g. 18"
                          value={newAgeGroupMin}
                          onChange={(e) => setNewAgeGroupMin(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Button onClick={addAgeGroup} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Age Group
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Current Age Groups
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid gap-4">
                      {Object.entries(settings.ageGroups).map(
                        ([name, value]) => (
                          <div
                            key={name}
                            className="flex justify-between items-center p-2 rounded-md border"
                          >
                            <div>
                              <Badge variant="outline" className="mr-2">
                                {name}
                              </Badge>
                              {Array.isArray(value) ? (
                                <span>
                                  Ages {value[0]} to {value[1]}
                                </span>
                              ) : (
                                <span>Age {value}+</span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAgeGroup(name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <MetricsTab
            saveSettings={saveSettings}
          newMetricName={newMetricName}
          setSettings={setSettings}
          settings={settings}
          newMetricRegex={newMetricRegex}
          setNewMetricName={setNewMetricName}
          setNewMetricRegex={setNewMetricRegex}
        />
        {/* Points Tab */}
        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle>Points Allocation</CardTitle>
              <CardDescription>
                Configure points awarded for placements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Tabs
                  value={pointsType}
                  onValueChange={(value) =>
                    setPointsType(value as "individual" | "team")
                  }
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="individual">Individual</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="individual" className="pt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPointPlace">Place</Label>
                          <Input
                            id="newPointPlace"
                            type="number"
                            placeholder="e.g. 1, 2, 3"
                            value={newPointPlace}
                            onChange={(e) => setNewPointPlace(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPointValue">Points</Label>
                          <Input
                            id="newPointValue"
                            type="number"
                            placeholder="e.g. 10, 8, 6"
                            value={newPointValue}
                            onChange={(e) => setNewPointValue(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={addPointAllocation}
                        className="w-full md:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Point Allocation
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Current Individual Points
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <div className="grid gap-4">
                          {settings.points.individual &&
                            Object.entries(settings.points.individual)
                              .sort(
                                ([a], [b]) =>
                                  Number.parseInt(a) - Number.parseInt(b),
                              )
                              .map(([place, points]) => (
                                <div
                                  key={place}
                                  className="flex justify-between items-center p-2 rounded-md border"
                                >
                                  <div>
                                    <Badge variant="outline" className="mr-2">
                                      Place {place}
                                    </Badge>
                                    <span>{points} points</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removePointAllocation(
                                        "individual",
                                        Number.parseInt(place),
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="team" className="pt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="newPointPlace">Place</Label>
                          <Input
                            id="newPointPlace"
                            type="number"
                            placeholder="e.g. 1, 2, 3"
                            value={newPointPlace}
                            onChange={(e) => setNewPointPlace(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPointValue">Points</Label>
                          <Input
                            id="newPointValue"
                            type="number"
                            placeholder="e.g. 12, 8, 6"
                            value={newPointValue}
                            onChange={(e) => setNewPointValue(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        onClick={addPointAllocation}
                        className="w-full md:w-auto"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Point Allocation
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Current Team Points
                      </h3>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <div className="grid gap-4">
                          {settings.points.team &&
                            Object.entries(settings.points.team)
                              .sort(
                                ([a], [b]) =>
                                  Number.parseInt(a) - Number.parseInt(b),
                              )
                              .map(([place, points]) => (
                                <div
                                  key={place}
                                  className="flex justify-between items-center p-2 rounded-md border"
                                >
                                  <div>
                                    <Badge variant="outline" className="mr-2">
                                      Place {place}
                                    </Badge>
                                    <span>{points} points</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removePointAllocation(
                                        "team",
                                        Number.parseInt(place),
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
