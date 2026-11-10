import { describe, expect, it } from 'vitest';
import { GET as githubGET } from '@/app/api/github-contributions/route';
import { GET as healthGET } from '@/app/api/health/route';
import { POST as bookingPOST } from '@/app/api/booking/route';

describe('API routes', () => {
  it('returns a health payload', async () => {
    const response = await healthGET(new Request('http://localhost/api/health'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('success');
    expect(typeof body.timestamp).toBe('string');

    const corsResponse = await healthGET(
      new Request('http://localhost/api/health', { headers: { Origin: 'http://localhost:3000' } })
    );
    expect(corsResponse.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
  });

  it('rejects invalid GitHub usernames', async () => {
    const response = await githubGET(
      new Request('http://localhost/api/github-contributions?username=<script>')
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe('error');
  });

  it('validates booking payloads', async () => {
    const response = await bookingPOST(
      new Request('http://localhost/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'x', email: 'bad', date: '2000-01-01', time: '25:99' }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.status).toBe('error');
    expect(Array.isArray(body.details)).toBe(true);
  });
});
