"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("athlete");

  async function submit() {
    const { data } = await supabase.auth.getUser();

    await supabase.from("profiles").insert({
      user_id: data.user?.id,
      role: "creator",
      onboarded: true,
      full_name: name,
      creator_type: type,
    });

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-10 bg-card rounded-xl w-[400px]">
        <h1 className="text-2xl mb-6">Creator onboarding</h1>

        <input
          className="w-full border p-3 mb-4"
          placeholder="Full name"
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="w-full border p-3 mb-6"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="athlete">Athlete</option>
          <option value="podcast">Podcast</option>
          <option value="event">Event</option>
        </select>

        <button
          onClick={submit}
          className="w-full bg-primary p-3 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}