/**
 * Home Assistant adapter (build plan §11). All calls go device -> HA directly,
 * no third party. The long-lived token is kept in expo-secure-store (guarded
 * fallback on web); the base URL lives in the settings table. If unconfigured,
 * nothing here is ever called.
 */
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { repository } from '@/data/sqliteRepository';

const TOKEN_KEY = 'ha.token';

function trimUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* secure store unavailable */
  }
}

export interface HAConfig {
  baseUrl: string | null;
  token: string | null;
}

export async function getHAConfig(): Promise<HAConfig> {
  const baseUrl = await repository.getSetting('ha.baseUrl');
  const token = await getToken();
  return { baseUrl, token };
}

export async function saveHAConfig(baseUrl: string, token: string): Promise<void> {
  await repository.setSetting('ha.baseUrl', trimUrl(baseUrl.trim()));
  if (token.trim()) await setToken(token.trim());
  await repository.setSetting('ha.connected', '1');
}

export async function clearHAConfig(): Promise<void> {
  await repository.setSetting('ha.baseUrl', '');
  await repository.setSetting('ha.connected', '');
  await setToken('');
}

/** GET /api/ — returns true on a 200 with a valid token. */
export async function testConnection(baseUrl: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${trimUrl(baseUrl)}/api/`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function authedPost(path: string, body: object): Promise<boolean> {
  const { baseUrl, token } = await getHAConfig();
  if (!baseUrl || !token) return false;
  try {
    const res = await fetch(`${trimUrl(baseUrl)}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function fireEvent(eventType: string, data: object = {}): Promise<boolean> {
  return authedPost(`/api/events/${encodeURIComponent(eventType)}`, data);
}

export function callService(domain: string, service: string, data: object = {}): Promise<boolean> {
  return authedPost(`/api/services/${encodeURIComponent(domain)}/${encodeURIComponent(service)}`, data);
}
