"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface SettingsClientProps {
  patient: any;
}

export function SettingsClient({ patient: _patient }: SettingsClientProps) {
  const [activeSection, setActiveSection] = useState<"notifications" | "privacy" | "security">(
    "notifications"
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailAppointmentReminders: true,
    smsAppointmentReminders: true,
    pushNotifications: true,
    emailMarketing: false,
    appointmentUpdates: true,
    queueUpdates: true,
    emergencyAlerts: true,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareDataWithDoctors: true,
    allowResearch: false,
    showProfileToOthers: false,
    dataRetention: "2years",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const supabase = createClient();

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      // In a real app, save to database
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Privacy settings saved successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("All password fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirm) return;

    const confirmText = window.prompt('Type "DELETE" to confirm account deletion:');

    if (confirmText !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    setLoading(true);
    try {
      // In a real app, call account deletion API
      toast.error("Account deletion is not implemented yet");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("notifications")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeSection === "notifications"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="font-medium">Notifications</span>
              </button>
              <button
                onClick={() => setActiveSection("privacy")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeSection === "privacy"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Privacy</span>
              </button>
              <button
                onClick={() => setActiveSection("security")}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeSection === "security"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Lock className="h-5 w-5" />
                <span className="font-medium">Security</span>
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications about your appointments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-gray-600">
                              Get reminded about upcoming appointments
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.emailAppointmentReminders}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailAppointmentReminders: checked as boolean,
                            })
                          }
                        />
                      </label>

                      <label className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-gray-600">
                              Receive health tips and offers
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.emailMarketing}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailMarketing: checked as boolean,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">SMS Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-gray-600">
                              SMS reminders 24h and 2h before appointment
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.smsAppointmentReminders}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              smsAppointmentReminders: checked as boolean,
                            })
                          }
                        />
                      </label>

                      <label className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Queue Updates</p>
                            <p className="text-sm text-gray-600">
                              Get notified when you're next in queue
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.queueUpdates}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              queueUpdates: checked as boolean,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Enable Push Notifications</p>
                            <p className="text-sm text-gray-600">
                              Receive real-time updates on your device
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushNotifications: checked as boolean,
                            })
                          }
                        />
                      </label>

                      <label className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-900">Emergency Alerts</p>
                            <p className="text-sm text-red-700">
                              Critical health and safety alerts
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={notificationSettings.emergencyAlerts}
                          onCheckedChange={(checked) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emergencyAlerts: checked as boolean,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Privacy Section */}
          {activeSection === "privacy" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control how your data is used and shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Share Data with Healthcare Providers</p>
                        <p className="text-sm text-gray-600">
                          Allow doctors to view your medical history
                        </p>
                      </div>
                      <Checkbox
                        checked={privacySettings.shareDataWithDoctors}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            shareDataWithDoctors: checked as boolean,
                          })
                        }
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Allow Anonymous Research</p>
                        <p className="text-sm text-gray-600">
                          Help improve healthcare with anonymized data
                        </p>
                      </div>
                      <Checkbox
                        checked={privacySettings.allowResearch}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            allowResearch: checked as boolean,
                          })
                        }
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-gray-600">
                          Show your profile to other patients
                        </p>
                      </div>
                      <Checkbox
                        checked={privacySettings.showProfileToOthers}
                        onCheckedChange={(checked) =>
                          setPrivacySettings({
                            ...privacySettings,
                            showProfileToOthers: checked as boolean,
                          })
                        }
                      />
                    </label>

                    <div className="rounded-lg border p-4">
                      <Label htmlFor="dataRetention">Data Retention Period</Label>
                      <select
                        id="dataRetention"
                        className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={privacySettings.dataRetention}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            dataRetention: e.target.value,
                          })
                        }
                      >
                        <option value="1year">1 Year</option>
                        <option value="2years">2 Years</option>
                        <option value="5years">5 Years</option>
                        <option value="forever">Forever</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-600">
                        How long should we keep your inactive records
                      </p>
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords({ ...passwords, current: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Changing..." : "Change Password"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="w-full"
                  >
                    Delete Account
                  </Button>
                  <p className="mt-2 text-xs text-red-700">
                    This will permanently delete your account and all associated data. This
                    action cannot be undone.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

