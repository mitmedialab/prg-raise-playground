type ImageRequest = { apiKey: string, prompt: string, size: 256 | 512 | 1024, numberOf: number };
type URL = string;

export const createImage = async ({ apiKey, prompt, size, numberOf: n }: ImageRequest): Promise<URL[]> => {
  const url = "https://api.openai.com/v1/images/generations";
  var bearer = 'Bearer ' + apiKey;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      n,
      size: `${size}x${size}`
    })
  });

  const json = await response.json();
  const { data } = json;
  return data.map(({ url }) => url);
}

