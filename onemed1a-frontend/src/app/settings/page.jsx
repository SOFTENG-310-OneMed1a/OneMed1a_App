// src/app/settings/page.jsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateProfile, uploadAvatar } from "./actions";

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

function initials(name = "") {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U"
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsPage({ searchParams }) {
  // await searchParams
  const sp = await searchParams;

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
  const avatarUrl = profile?.avatarUrl || "";

  const updatedOK = sp?.updated === "1";
  const avatarOK = sp?.avatar === "1";
  const errorKey = sp?.error;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Edit profile
      </h1>

      {/* banners */}
      {updatedOK && (
        <div className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 p-3">
          Profile updated successfully.
        </div>
      )}
      {avatarOK && (
        <div className="rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 p-3">
          Profile picture updated.
        </div>
      )}
      {errorKey && (
        <div className="rounded-xl bg-rose-50 text-rose-800 border border-rose-200 p-3">
          {errorKey === "upload"
            ? "Failed to upload avatar. Please try again."
            : errorKey === "nofile"
            ? "Please choose an image file to upload."
            : "Something went wrong."}
        </div>
      )}

      {/* Avatar upload */}
      <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
        <h2 className="text-base font-medium mb-4">Profile picture</h2>

        <div className="flex items-start gap-4">
          <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-200">
                      {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-24 w-24 rounded-2xl object-cover shadow"
            />
          ) : (
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 grid place-items-center text-2xl font-semibold text-slate-700 shadow">
              {initials(name)}
            </div>
          )}
          </div>
          <form action={uploadAvatar} className="flex items-center gap-3">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-black text-white px-4 py-2 text-sm hover:opacity-90"
            >
              Upload new picture
            </button>
          </form>
        </div>
      </section>

      {/* Profile fields */}
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
                defaultValue={avatarUrl}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                placeholder="https://..."
              />
            </label>

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
          <a href="/profile" className="text-sm text-slate-600 hover:text-black">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
