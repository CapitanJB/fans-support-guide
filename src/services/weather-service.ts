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
 * Returns a translation key and emoji for WMO codes
 */
export function getWeatherInfo(code: number): { key: string; emoji: string } {
  const codes: Record<number, { key: string; emoji: string }> = {
    0: { key: 'weather.condition.0', emoji: '☀️' },
    1: { key: 'weather.condition.1', emoji: '🌤️' },
    2: { key: 'weather.condition.2', emoji: '⛅' },
    3: { key: 'weather.condition.3', emoji: '☁️' },
    45: { key: 'weather.condition.45', emoji: '🌫️' },
    48: { key: 'weather.condition.48', emoji: '🌫️' },
    51: { key: 'weather.condition.51', emoji: '🌦️' },
    53: { key: 'weather.condition.53', emoji: '🌦️' },
    55: { key: 'weather.condition.55', emoji: '🌦️' },
    61: { key: 'weather.condition.61', emoji: '🌧️' },
    63: { key: 'weather.condition.63', emoji: '🌧️' },
    65: { key: 'weather.condition.65', emoji: '🌧️' },
    71: { key: 'weather.condition.71', emoji: '🌨️' },
    73: { key: 'weather.condition.73', emoji: '🌨️' },
    75: { key: 'weather.condition.75', emoji: '🌨️' },
    80: { key: 'weather.condition.80', emoji: '🌦️' },
    81: { key: 'weather.condition.81', emoji: '🌦️' },
    82: { key: 'weather.condition.82', emoji: '🌧️' },
    95: { key: 'weather.condition.95', emoji: '⛈️' },
    96: { key: 'weather.condition.96', emoji: '⛈️' },
    99: { key: 'weather.condition.99', emoji: '⛈️' }
  };

  return codes[code] || { key: 'weather.condition.unknown', emoji: '🌡️' };
}
