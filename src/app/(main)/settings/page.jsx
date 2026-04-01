"use client";

import { useEffect, useState } from "react";
import Button from "@/presentation/components/ui/Button.jsx";
import Card from "@/presentation/components/ui/Card.jsx";
import ErrorBoundary from "@/presentation/components/ui/ErrorBoundary.jsx";
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
  "w-full cursor-pointer rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] py-3 pl-4 pr-10 text-[var(--text-primary)] outline-none transition focus:border-[var(--border-subtle)] focus:ring-2 focus:ring-[var(--border-subtle)] bg-[right_1rem_center]";

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
      <ErrorBoundary>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
              Preferences
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] transition-colors">
              Settings
            </h1>
          </div>

          <Card>
            <p className="text-sm text-[var(--text-secondary)]">Loading settings...</p>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-red-500">
            Preferences
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] transition-colors">
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
                <span className="block text-sm font-medium text-[var(--text-secondary)]">
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
                <span className="block text-sm font-medium text-[var(--text-secondary)]">
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
    </ErrorBoundary>
  );
}
