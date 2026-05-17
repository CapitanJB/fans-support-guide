/**
 * Match Service - Core engine for match-driven survival guide
 * Fetches data from Google Sheets (POIs, Matches, Timeline)
 */

export interface PointOfInterest {
  id: string;
  nombre: string;
  categoria: string;
  latitud: number;
  longitud: number;
  descripcion: string;
  direccion: string;
  icono?: string;
  ciudad: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string; // ISO or YYYY-MM-DD
  time: string;
  stadiumId: string;
  ciudad: string;
  stadium?: PointOfInterest;
}

export interface TimelineEvent {
  matchId: string;
  type: string;
  time: string;
  title: string;
  description: string;
  poiId?: string;
  poi?: PointOfInterest;
}

const URLS = {
  POIS: import.meta.env.CSV_URL_POIS || 'REPLACE_WITH_YOUR_GOOGLE_SHEETS_CSV_URL_FOR_POIS',
  MATCHES: import.meta.env.CSV_URL_MATCHES || 'REPLACE_WITH_YOUR_GOOGLE_SHEETS_CSV_URL_FOR_MATCHES',
  TIMELINE: import.meta.env.CSV_URL_TIMELINE || 'REPLACE_WITH_YOUR_GOOGLE_SHEETS_CSV_URL_FOR_TIMELINE'
};

const CACHE_KEY = 'survival_guide_data';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Robust CSV parser that handles newlines and commas within quoted fields.
 */
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Handle escaped quotes ("")
        current += '"';
        i++; // Skip the second quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      // End of row
      if (current !== '' || row.length > 0) {
        row.push(current.trim());
        result.push(row);
        current = '';
        row = [];
      }
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
    } else {
      current += char;
    }
  }
  
  // Handle last row if file doesn't end with a newline
  if (current !== '' || row.length > 0) {
    row.push(current.trim());
    result.push(row);
  }
  
  return result;
}

async function fetchCSV(url: string): Promise<string[][]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error loading CSV: ${url}`);
  const text = await response.text();
  return parseCSV(text);
}

export async function getSurvivalData() {
  // Check Cache
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && !navigator.onLine) {
        return data;
      }
    }
  }

  try {
    const [poisRaw, matchesRaw, timelineRaw] = await Promise.all([
      fetchCSV(URLS.POIS),
      fetchCSV(URLS.MATCHES),
      fetchCSV(URLS.TIMELINE)
    ]);

    const pois: PointOfInterest[] = poisRaw.slice(1).map(cols => ({
      id: cols[0],
      nombre: cols[1],
      categoria: cols[2],
      latitud: parseFloat(cols[3]),
      longitud: parseFloat(cols[4]),
      descripcion: cols[5],
      direccion: cols[6],
      icono: cols[7],
      ciudad: cols[8]
    })).filter(p => !isNaN(p.latitud));

    const matches: Match[] = matchesRaw.slice(1).map(cols => ({
      id: cols[0],
      homeTeam: cols[1],
      awayTeam: cols[2],
      date: cols[3],
      time: cols[4],
      stadiumId: cols[5],
      ciudad: cols[6],
      stadium: pois.find(p => p.id === cols[5])
    }));

    const timeline: TimelineEvent[] = timelineRaw.slice(1).map(cols => ({
      matchId: cols[0],
      type: cols[1],
      time: cols[2],
      title: cols[3],
      description: cols[4],
      poiId: cols[5],
      poi: pois.find(p => p.id === cols[5])
    }));

    const result = { pois, matches, timeline };

    // Save to Cache
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
    }

    return result;
  } catch (error) {
    console.error('Error fetching survival data:', error);
    // Try to return cache even if expired if we are offline
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached).data;
    }
    return { pois: [], matches: [], timeline: [] };
  }
}

