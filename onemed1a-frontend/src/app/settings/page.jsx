import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

async function fetchJSON(path, init) {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store", ...init });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const tokenCookie = await cookieStore.get("access_token");
  if (!tokenCookie) redirect("/login");

  const cookieHeader = `access_token=${tokenCookie.value}`;
  const profile = await fetchJSON("/api/v1/getprofile", {
    headers: { cookie: cookieHeader },
  });
  if (!profile?.id) redirect("/login");

  // fallbacks
  const name =
    profile?.fullName ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "";
  const region = profile?.region || profile?.preferences?.region || "NZ";
  const language = profile?.language || profile?.preferences?.language || "en";
  const theme = profile?.theme || profile?.preferences?.theme || "system";

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Edit profile</h1>

      <form action={updateProfile} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
          <h2 className="text-base font-medium mb-4">Basic info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-slate-700">Full name</span>
              <input
                name="fullName"
                defaultValue={name}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="Your full name"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Avatar URL</span>
              <input
                name="avatarUrl"
                defaultValue={profile?.avatarUrl || ""}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="https://..."
              />
            </label>

            {/* If your API wants first/last separately, keep these fields */}
            <label className="block">
              <span className="text-sm text-slate-700">First name</span>
              <input
                name="firstName"
                defaultValue={profile?.firstName || ""}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Last name</span>
              <input
                name="lastName"
                defaultValue={profile?.lastName || ""}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
          <h2 className="text-base font-medium mb-4">Preferences</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-sm text-slate-700">Theme</span>
              <select
                name="theme"
                defaultValue={theme}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Region</span>
              <select
                name="region"
                defaultValue={region}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="NZ">NZ</option>
                <option value="AU">AU</option>
                <option value="US">US</option>
                <option value="UK">UK</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-slate-700">Content language</span>
              <select
                name="language"
                defaultValue={language}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              >
                <option value="en">English</option>
                <option value="mi">Māori</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90"
          >
            Save changes
          </button>
          <a
            href="/profile"
            className="text-sm text-slate-600 hover:text-black"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
