// Backend error shape: ApiResponse { timeStamp, data: null, error: { status, message, subErrors } }
export function extractError(err, fallback = 'Something went wrong') {
  if (!err) return fallback;
  if (!err.response) return 'Network error — is the backend running on port 8080?';
  const body = err.response.data;
  // Unwrap ApiResponse error wrapper
  const apiError = body?.error;
  if (apiError?.message) return String(apiError.message);
  if (body?.message) return String(body.message);
  if (body?.error && typeof body.error === 'string') return body.error;
  return `Error ${err.response.status}`;
}
