"use client";

import { useState } from "react";
import { profile } from "@/data/portfolio";
import { BookingModal } from "./BookingModal";
import { Reveal } from "./Reveal";

export function Contact() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section id="contact" className="border-t border-line px-6 py-24 md:px-16 md:py-32 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red">Contact / Start a conversation</p>
            <h2 className="mt-6 max-w-3xl text-6xl font-medium leading-[0.95] tracking-[-0.07em] md:text-8xl">
              Have something worth building?
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <p className="text-base leading-8 text-muted">
              Tell me about the product, the problem, and where it is stuck. I’ll bring product thinking, interface polish, and engineering depth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                Book a call ↗
              </button>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-red hover:text-red"
              >
                {profile.email}
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-red hover:text-red"
              >
                Resume ↗
              </a>
            </div>
          </div>
        </Reveal>
      </div>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
