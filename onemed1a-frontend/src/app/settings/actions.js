"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

// small helper to read + trim a form field safely
function readField(fd, name, fallback = "") {
  const raw = fd.get(name);
  // handle File objects or nulls gracefully
  if (raw == null) return fallback;
  const s = typeof raw === "string" ? raw : String(raw);
  return s.trim();
}

// optional: if your backend wants nulls for empty values
function emptyToNull(s) {
  return s === "" ? null : s;
}

export async function updateProfile(formData) {
  // 1) auth via cookie (same as your profile page)
  const cookieStore = await cookies();
  const tokenCookie = await cookieStore.get("access_token");
  if (!tokenCookie) redirect("/login");
  const cookieHeader = `access_token=${tokenCookie.value}`;

  // 2) get current user id
  const meRes = await fetch(`${API_BASE}/api/v1/getprofile`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!meRes.ok) redirect("/login");
  const me = await meRes.json().catch(() => null);
  if (!me?.id) redirect("/login");

  // 3) build payload safely
  const fullName  = emptyToNull(readField(formData, "fullName"));
  const firstName = emptyToNull(readField(formData, "firstName"));
  const lastName  = emptyToNull(readField(formData, "lastName"));
  const avatarUrl = emptyToNull(readField(formData, "avatarUrl"));
  const theme     = readField(formData, "theme", "system");
  const region    = readField(formData, "region", "NZ");
  const language  = readField(formData, "language", "en");

  // If your API wants flat fields:
  const payload = {
    fullName,
    firstName,
    lastName,
    avatarUrl,
    theme,
    region,
    language,
  };

  // If your API wants nested preferences, use this instead:
  // const payload = {
  //   fullName, firstName, lastName, avatarUrl,
  //   preferences: { theme, region, language },
  // };

  // 4) send PATCH (change endpoint/method if your API differs)
  const res = await fetch(`${API_BASE}/api/v1/users/${me.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    // surface backend error text in dev logs if needed
    const errText = await res.text().catch(() => "");
    console.error("updateProfile failed:", errText);

    redirect("/settings?error=1");
  }

  // revalidate pages that show this data
  revalidatePath("/profile");
  revalidatePath("/settings");

  // redirect with a success flag
  redirect("/profile?updated=1");
}
