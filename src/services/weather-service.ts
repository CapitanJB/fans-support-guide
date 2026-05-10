/**
 * Weather Service for Survival Guide
 * Using Open-Meteo (0€ Cost Strategy)
 */
import type { Match } from './match-service';

export interface WeatherData {
  temp: number;
  condition: number; // WMO Weather interpretation codes
  time: string;
  isStale: boolean;
  isForecast?: boolean;
  staleTime?: string;
}

const CACHE_KEY_PREFIX = 'match_weather_';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour for specific match weather

/**
 * Fetch weather for a specific match date and location
 */
export async function getMatchWeather(match: Match): Promise<WeatherData | null> {
  if (!match.stadium) return null;

  const cacheKey = `${CACHE_KEY_PREFIX}${match.id}`;
  
  // Check Cache
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && !navigator.onLine) {
        return { ...data, isStale: true, staleTime: new Date(timestamp).toLocaleTimeString() };
      }
    }
  }

  try {
    const lat = match.stadium.latitud;
    const lon = match.stadium.longitud;
    
    // Parse date from DD/MM/YYYY to YYYY-MM-DD for API
    const dateParts = match.date.split('/');
    let apiDate = match.date;
    if (dateParts.length === 3) {
      apiDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    const matchDate = new Date(apiDate);
    const now = new Date();
    const diffDays = Math.ceil((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Open-Meteo forecast limit is ~14 days. 
    // If it's further away, we can't get a real forecast yet.
    if (diffDays > 14 || diffDays < -1) {
      return null; // Signals "Too far in the future/past"
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max&start_date=${apiDate}&end_date=${apiDate}&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API error');
    
    const json = await response.json();
    
    const data: WeatherData = {
      temp: json.daily.temperature_2m_max[0],
      condition: json.daily.weathercode[0],
      time: new Date().toISOString(),
      isStale: false,
      isForecast: true
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    }

    return data;

  } catch (error) {
    console.error('Error fetching match weather:', error);
    return null;
  }
}

/**
 * Returns a human-readable description and emoji for WMO codes
 */
export function getWeatherDescription(code: number): { text: string; emoji: string } {
  const codes: Record<number, { text: string; emoji: string }> = {
    0: { text: 'Despejado', emoji: '☀️' },
    1: { text: 'Principalmente despejado', emoji: '🌤️' },
    2: { text: 'Parcialmente nublado', emoji: '⛅' },
    3: { text: 'Nublado', emoji: '☁️' },
    45: { text: 'Niebla', emoji: '🌫️' },
    48: { text: 'Escarcha', emoji: '🌫️' },
    51: { text: 'Llovizna ligera', emoji: '🌦️' },
    53: { text: 'Llovizna moderada', emoji: '🌦️' },
    55: { text: 'Llovizna densa', emoji: '🌦️' },
    61: { text: 'Lluvia ligera', emoji: '🌧️' },
    63: { text: 'Lluvia moderada', emoji: '🌧️' },
    65: { text: 'Lluvia fuerte', emoji: '🌧️' },
    71: { text: 'Nieve ligera', emoji: '🌨️' },
    73: { text: 'Nieve moderada', emoji: '🌨️' },
    75: { text: 'Nieve fuerte', emoji: '🌨️' },
    80: { text: 'Chubascos ligeros', emoji: '🌦️' },
    81: { text: 'Chubascos moderados', emoji: '🌦️' },
    82: { text: 'Chubascos violentos', emoji: '🌧️' },
    95: { text: 'Tormenta eléctrica', emoji: '⛈️' },
    96: { text: 'Tormenta con granizo ligero', emoji: '⛈️' },
    99: { text: 'Tormenta con granizo fuerte', emoji: '⛈️' }
  };

  return codes[code] || { text: 'Desconocido', emoji: '🌡️' };
}
