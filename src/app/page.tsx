"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const NOT_AGAIN_AUDIO_URL = '/not_again.mp3';

export default function Home() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const handleUnplug = () => {
      if (enabled) {
        const audio = new Audio(NOT_AGAIN_AUDIO_URL);
        audio.play().catch(error => {
          toast({
            title: "Audio Playback Failed",
            description: "Please ensure that audio playback is allowed in your browser settings.",
            variant: "destructive"
          });
        });
      }
    };

    window.addEventListener("unplug", handleUnplug);
    return () => {
      window.removeEventListener("unplug", handleUnplug);
    };
  }, [enabled]);

  // Mock charger detection for web demo purposes
  useEffect(() => {
    const mockUnplug = () => {
      const event = new Event("unplug");
      window.dispatchEvent(event);
    };

    // For demo, trigger after 5 seconds.  Clear timeout on unmount.
    const timeoutId = setTimeout(mockUnplug, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unplug Notifier Settings</CardTitle>
          <CardDescription>Enable or disable charger unplug notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <label
              htmlFor="notification-enabled"
              className={cn("text-sm font-medium leading-none")}
            >
              Notification Enabled
            </label>
            <Switch
              id="notification-enabled"
              checked={enabled}
              onCheckedChange={(checked) => {
                setEnabled(checked);
                toast({
                  title: "Settings Updated",
                  description: `Notifications ${checked ? 'enabled' : 'disabled'}.`,
                });
              }}
            />
          </div>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-muted-foreground">
        This app runs in the background and notifies you when the charger is unplugged.
      </p>
    </div>
  );
}
