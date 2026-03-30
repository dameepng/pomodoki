"use client";

import { useEffect, useState } from "react";
import Button from "@/presentation/components/ui/Button.jsx";
import Card from "@/presentation/components/ui/Card.jsx";
import Input from "@/presentation/components/ui/Input.jsx";
import { useToast } from "@/presentation/components/ui/Toast.jsx";

const DEFAULT_FORM_SETTINGS = {
  focusDuration: "25",
  shortBreakDuration: "5",
  longBreakDuration: "15",
  petType: "cat",
  ambientSound: "rain",
};

const PET_OPTIONS = ["cat", "dog", "bird", "plant"];
const AMBIENT_OPTIONS = [
  "rain",
  "brown_noise",
  "coffee_shop",
  "forest",
  "ocean",
  "fireplace",
  "none",
];

const SELECT_CLASS_NAME =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

function mapSettingsToForm(settings) {
  return {
    focusDuration: String((settings?.focusDuration ?? 1500) / 60),
    shortBreakDuration: String((settings?.shortBreakDuration ?? 300) / 60),
    longBreakDuration: String((settings?.longBreakDuration ?? 900) / 60),
    petType: settings?.petType ?? "cat",
    ambientSound: settings?.ambientSound ?? "rain",
  };
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export default function SettingsPage() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        const data = await parseJsonResponse(response);

        if (!response.ok) {
          throw new Error(data.error || "Failed to load settings");
        }

        if (isMounted) {
          setSettings(mapSettingsToForm(data.settings));
        }
      } catch (loadError) {
        if (isMounted) {
          addToast({
            message: loadError.message || "Failed to load settings",
            type: "error",
          });
          setSettings(DEFAULT_FORM_SETTINGS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [addToast]);

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!settings) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        focusDuration: Math.round(Number(settings.focusDuration) * 60),
        shortBreakDuration: Math.round(Number(settings.shortBreakDuration) * 60),
        longBreakDuration: Math.round(Number(settings.longBreakDuration) * 60),
        petType: settings.petType,
        ambientSound: settings.ambientSound,
      };

      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings(mapSettingsToForm(data.settings));
      addToast({ message: "Settings saved!", type: "success" });
    } catch (saveError) {
      addToast({
        message: saveError.message || "Failed to save settings",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
            Preferences
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>
        </div>

        <Card>
          <p className="text-sm text-slate-500">Loading settings...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
          Preferences
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>
      </div>

      <Card>
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Focus Duration (minutes)"
              type="number"
              min="1"
              value={settings?.focusDuration ?? ""}
              onChange={handleFieldChange("focusDuration")}
            />
            <Input
              label="Short Break (minutes)"
              type="number"
              min="1"
              value={settings?.shortBreakDuration ?? ""}
              onChange={handleFieldChange("shortBreakDuration")}
            />
            <Input
              label="Long Break (minutes)"
              type="number"
              min="1"
              value={settings?.longBreakDuration ?? ""}
              onChange={handleFieldChange("longBreakDuration")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">
                Pet Type
              </span>
              <select
                value={settings?.petType ?? "cat"}
                onChange={handleFieldChange("petType")}
                className={SELECT_CLASS_NAME}
              >
                {PET_OPTIONS.map((petType) => (
                  <option key={petType} value={petType}>
                    {petType}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">
                Ambient Sound Default
              </span>
              <select
                value={settings?.ambientSound ?? "rain"}
                onChange={handleFieldChange("ambientSound")}
                className={SELECT_CLASS_NAME}
              >
                {AMBIENT_OPTIONS.map((soundId) => (
                  <option key={soundId} value={soundId}>
                    {soundId}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
