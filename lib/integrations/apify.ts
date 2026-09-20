export interface ApifyActorInput {
  actorId: string;
  input: Record<string, any>;
}

/**
 * Apify Specialized Actor Client for complex SPAs (Eventbrite, Devpost, F6S)
 */
export async function runApifyActor(actorId: string, input: Record<string, any>): Promise<any[]> {
  const apiToken = process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    console.log(`[Apify Collector] Token not configured yet. Actor: ${actorId}`);
    return [];
  }

  try {
    const res = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apiToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (!res.ok) {
      console.warn(`Apify Actor launch failed: HTTP ${res.status}`);
      return [];
    }

    const runData = await res.json();
    const datasetId = runData.data?.defaultDatasetId;

    if (!datasetId) return [];

    const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}`);
    if (!datasetRes.ok) return [];

    return await datasetRes.json();
  } catch (error: any) {
    console.error(`[Apify Error] ${error.message}`);
    return [];
  }
}
