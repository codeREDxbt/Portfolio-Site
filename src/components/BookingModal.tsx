"use client";

import { useEffect, useMemo, useState } from "react";
import { profile } from "@/data/portfolio";

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "18:00", "18:30"];

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function BookingModal({ open, onClose }: BookingModalProps) {
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);
      return date;
    });
  }, []);

  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (name.trim().length < 2) {
      setStatus("error");
      setMessage("Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, date: toDateValue(selectedDay), time: selectedTime }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Booking failed");
      setStatus("success");
      setMessage(result.message || "Booking confirmed. I will reach out shortly.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Booking failed. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button aria-label="Close booking dialog" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <div className="relative grid max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-line bg-surface md:grid-cols-[280px_1fr]">
        <aside className="border-b border-line bg-surface-strong p-8 md:border-b-0 md:border-r">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red font-mono text-sm text-background">cR</div>
          <h2 className="mt-6 text-lg font-medium">{profile.name}</h2>
          <h3 id="booking-title" className="mt-5 text-3xl font-medium tracking-[-0.04em]">15 Min Meeting</h3>
          <p className="mt-4 text-sm leading-6 text-muted">15m / Discord / Asia/Kolkata</p>
          <p className="mt-8 text-sm leading-7 text-muted">A focused call about your product, problem, and next step.</p>
        </aside>

        <form onSubmit={submit} className="grid gap-8 p-6 md:grid-cols-[1fr_240px] md:p-8">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-medium">Choose a day</h3>
              <button type="button" autoFocus onClick={onClose} className="text-sm text-muted transition-colors hover:text-foreground">
                Close ×
              </button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {days.map((day) => {
                const selected = selectedDay.toDateString() === day.toDateString();
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-2xl border px-4 py-3 text-left transition-colors ${selected ? "border-red bg-red text-background" : "border-line bg-background text-foreground hover:border-red"}`}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
                      {day.toLocaleDateString("en", { weekday: "short" })}
                    </span>
                    <span className="mt-1 block text-sm font-medium">
                      {day.toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-xl border border-line bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-red"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Email</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-xl border border-line bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-red"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium">Select a time</h3>
            <div className="mt-6 grid gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-xl border px-4 py-3 text-sm transition-colors ${selectedTime === time ? "border-red bg-red text-background" : "border-line text-muted hover:border-red hover:text-foreground"}`}
                >
                  {time}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "submitting" ? "Confirming…" : "Confirm booking"}
            </button>
            {message ? (
              <p className={`mt-4 text-sm ${status === "success" ? "text-green" : "text-red"}`} role="status">
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
