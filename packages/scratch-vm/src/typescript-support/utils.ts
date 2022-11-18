type FetchParams = {
  request: Parameters<typeof fetch>[0],
  options: Parameters<typeof fetch>[1]
}

export async function fetchWithTimeout(
  resource: FetchParams["request"],
  options: FetchParams["options"] & { timeout: number }
) {
  const { timeout } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });

  clearTimeout(id);

  return response;
}