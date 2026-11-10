import { apiError, apiJson, applyCors, corsPreflight } from '@/lib/api';

export function GET(request: Request) {
  return applyCors(
    request,
    apiJson({
      status: 'success',
      message: 'API is running securely',
      timestamp: new Date().toISOString(),
    })
  );
}

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export function POST(request: Request) {
  return applyCors(request, apiError(405, 'Method not allowed'));
}
