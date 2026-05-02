"use client";

import { useState, useEffect } from "react";
import { type AppSettings } from "@/lib/storage";

const defaultSettings: AppSettings = {
  portfolioShowZeroBalances: true,
  defaultTokenSourceFilter: "all",
  defaultAddressSourceFilter: "all",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sandwich_settings");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch {
      console.error("Failed to load settings from localStorage");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem("sandwich_settings", JSON.stringify(newSettings));
      } catch {
        console.error("Failed to save settings to localStorage");
      }
      return newSettings;
    });
  };

  const refresh = () => {
    try {
      const stored = localStorage.getItem("sandwich_settings");
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } else {
        setSettings(defaultSettings);
      }
    } catch {
      console.error("Failed to refresh settings from localStorage");
    }
  };

  return { settings, updateSettings, isLoaded, refresh };
}
