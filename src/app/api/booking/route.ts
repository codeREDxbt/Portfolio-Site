import { apiError, apiJson, applyCors, corsPreflight, getClientIp, rateLimit } from "@/lib/api";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 5;

type BookingPayload = {
  name?: unknown;
  email?: unknown;
  date?: unknown;
  time?: unknown;
};

function validateBooking(data: BookingPayload) {
  const errors: string[] = [];
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const date = typeof data.date === "string" ? data.date : "";
  const time = typeof data.time === "string" ? data.time : "";

  if (name.length < 2 || name.length > 100) errors.push("Name must be 2-100 characters");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.push("Invalid email address");

  const bookingDate = new Date(`${date}T00:00:00.000Z`);
  const today = new Date().toISOString().slice(0, 10);
  if (!date || Number.isNaN(bookingDate.getTime())) errors.push("Invalid date format");
  else if (date < today) errors.push("Cannot book dates in the past");

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) errors.push("Invalid time format");

  return { errors, name, email, date, time };
}

async function notifyDiscord(booking: { name: string; email: string; date: string; time: string }) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `📅 New booking request\nName: ${booking.name}\nEmail: ${booking.email}\nDate: ${booking.date}\nTime: ${booking.time}`,
    }),
  });
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`booking:${ip}`, LIMIT, WINDOW_MS);

  if (!limit.allowed) {
    return applyCors(
      request,
      apiError(429, "Too many booking submissions. Please try again in an hour.", {
        retryAfter: new Date(limit.resetTime).toISOString(),
      }),
    );
  }

  try {
    const payload = (await request.json()) as BookingPayload;
    const booking = validateBooking(payload);

    if (booking.errors.length) {
      return applyCors(request, apiError(400, "Validation failed", booking.errors));
    }

    try {
      await notifyDiscord(booking);
    } catch {
      // Do not fail a valid booking because a notification webhook is unavailable.
    }

    return applyCors(
      request,
      apiJson({
        status: "success",
        message: "Booking confirmed! I will reach out shortly.",
        booking: { date: booking.date, time: booking.time },
      }),
    );
  } catch {
    return applyCors(request, apiError(400, "Invalid JSON body"));
  }
}

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export function GET(request: Request) {
  return applyCors(request, apiError(405, "Method not allowed"));
}
