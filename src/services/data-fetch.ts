/**
 * Servicio para obtener datos de POIs
 * @deprecated Usar match-service.ts para obtener datos unificados
 */
import { getSurvivalData, type PointOfInterest } from './match-service';

export type { PointOfInterest };

export async function fetchPOIs(): Promise<PointOfInterest[]> {
  const { pois } = await getSurvivalData();
  return pois;
}
