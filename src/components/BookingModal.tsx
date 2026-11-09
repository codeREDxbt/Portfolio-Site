'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profile } from '@/data/portfolio';
import { lockPageScroll } from '@/lib/scroll';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
};

const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '18:00', '18:30'];

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
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const unlockScroll = lockPageScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open, onClose]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // remember the trigger, restore focus on close (A3)
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    return () => {
      triggerRef.current?.focus?.();
    };
  }, [open]);

  // move focus into the confirmation when it replaces the form
  useEffect(() => {
    if (status === 'success') confirmRef.current?.focus();
  }, [status]);

  // the dialog portals to <body>; everything else becomes inert while open
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const siblings = Array.from(document.body.children).filter(
      (el) => el !== dialog && el.tagName !== 'SCRIPT'
    );
    siblings.forEach((el) => el.setAttribute('inert', ''));
    return () => siblings.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  // after closing a confirmed booking, reset back to the form for next time
  useEffect(() => {
    if (open || status === 'idle') return;
    const timer = window.setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 400);
    return () => window.clearTimeout(timer);
  }, [open, status]);

  // focus trap: cycle Tab/Shift+Tab within the dialog
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (name.trim().length < 2) {
      setStatus('error');
      setMessage('Please enter your name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date: toDateValue(selectedDay), time: selectedTime }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Booking failed');
      setStatus('success');
      setMessage(result.message || 'Booking confirmed. I will reach out shortly.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Booking failed. Please try again.');
    }
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={dialogRef}
          onKeyDown={handleKeyDown}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.28 }}
        >
          <button
            aria-label="Close booking dialog"
            className="absolute inset-0 cursor-default"
            onClick={onClose}
            type="button"
            tabIndex={-1}
          />
          <motion.div
            data-lenis-prevent
            className="relative grid max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-line bg-surface md:grid-cols-[280px_1fr]"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: reduced ? 0.12 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <aside className="border-b border-line bg-surface-strong p-8 md:border-b-0 md:border-r">
              <Image
                src="/brand/codeRED-logo.png"
                alt="codeRED logo"
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-line object-cover"
                priority
              />
              <h2 className="mt-6 text-lg font-medium">{profile.name}</h2>
              <h3 id="booking-title" className="mt-5 text-3xl font-medium tracking-[-0.04em]">
                15 Min Meeting
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted">15m / Discord / Asia/Kolkata</p>
              <p className="mt-8 text-sm leading-7 text-muted">
                A focused call about your product, problem, and next step.
              </p>
            </aside>

            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="confirmed"
                  role="status"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  ref={confirmRef}
                  tabIndex={-1}
                  className="flex flex-col items-center justify-center p-8 text-center outline-none md:p-12"
                >
                  <div className="relative">
                    <motion.svg
                      viewBox="0 0 64 64"
                      className="h-16 w-16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="29"
                        stroke="var(--red)"
                        strokeWidth="2"
                        initial={reduced ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <motion.path
                        d="M21 33.5l7.5 7.5L43 25"
                        stroke="var(--red)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduced ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          delay: reduced ? 0 : 0.45,
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </motion.svg>
                    {!reduced ? (
                      <>
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full border border-red"
                          initial={{ scale: 1, opacity: 0.55 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          transition={{ delay: 0.85, duration: 0.8, ease: 'easeOut' }}
                        />
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-full border border-red"
                          initial={{ scale: 1, opacity: 0.4 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ delay: 1.05, duration: 0.9, ease: 'easeOut' }}
                        />
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-8 text-3xl font-medium tracking-[-0.04em]">Signal locked.</h3>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-red">
                    {selectedDay.toLocaleDateString('en', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {selectedTime} IST
                  </p>
                  <p className="mt-4 max-w-[40ch] text-sm leading-7 text-muted">{message}</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-8 rounded-full border border-line px-6 py-3 text-sm text-muted transition-colors hover:border-red hover:text-red"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  className="grid gap-8 p-6 md:grid-cols-[1fr_240px] md:p-8"
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-medium">Choose a day</h3>
                      <button
                        type="button"
                        autoFocus
                        onClick={onClose}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
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
                            className={`relative rounded-2xl border px-4 py-3 text-left transition-colors ${selected ? 'border-red text-background' : 'border-line bg-background text-foreground hover:border-red'}`}
                          >
                            {selected ? (
                              <motion.span
                                layoutId="day-pill"
                                aria-hidden="true"
                                className="absolute inset-0 rounded-2xl bg-red"
                                transition={
                                  reduced
                                    ? { duration: 0.01 }
                                    : { type: 'spring', stiffness: 480, damping: 34 }
                                }
                              />
                            ) : null}
                            <span className="relative z-10 block font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
                              {day.toLocaleDateString('en', { weekday: 'short' })}
                            </span>
                            <span className="relative z-10 mt-1 block text-sm font-medium">
                              {day.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
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
                          className="w-full min-w-0 rounded-xl border border-dim bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-red"
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
                          className="w-full min-w-0 rounded-xl border border-dim bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-red"
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
                          className={`relative rounded-xl border px-4 py-3 text-sm transition-colors ${selectedTime === time ? 'border-red text-background' : 'border-line text-muted hover:border-red hover:text-foreground'}`}
                        >
                          {selectedTime === time ? (
                            <motion.span
                              layoutId="time-pill"
                              aria-hidden="true"
                              className="absolute inset-0 rounded-xl bg-red"
                              transition={
                                reduced
                                  ? { duration: 0.01 }
                                  : { type: 'spring', stiffness: 480, damping: 34 }
                              }
                            />
                          ) : null}
                          <span className="relative z-10">{time}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="group relative mt-6 w-full overflow-hidden rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 origin-left scale-x-0 bg-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover:text-background">
                        {status === 'submitting' ? 'Confirming…' : 'Confirm booking'}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </button>
                    {message ? (
                      <p
                        className="mt-4 text-sm text-red"
                        role="status"
                      >
                        {message}
                      </p>
                    ) : null}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
