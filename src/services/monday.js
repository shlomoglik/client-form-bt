const MONDAY_URL = 'https://api.monday.com/v2/'
export async function fetchMondayAPI(qry) {
    const result = await fetch(MONDAY_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': MONDAY_TOKEN
      },
      body: JSON.stringify({ 'query': qry })
    });
    if (result && result.status === 200) {
      const json = await result.json()
      if (json.data) return json.data
    }
    return []
  }