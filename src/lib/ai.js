// Thin wrapper around the ai-assistant Edge Function. Every call goes
// through Supabase's functions.invoke, which automatically attaches the
// signed-in attendee's auth token.
export async function askAssistant(client, payload) {
  const { data, error } = await client.functions.invoke('ai-assistant', { body: payload });
  if (error) {
    let message = error.message || 'The assistant is unavailable right now.';
    try {
      const body = await error.context.json();
      if (body && body.error) message = body.error;
    } catch {
      // ignore — fall back to error.message
    }
    throw new Error(message);
  }
  if (data && data.error) throw new Error(data.error);
  return data;
}
