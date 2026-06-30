const KEY = "brawl-advisor:account";

export interface AccountData {
  playerTag: string;   // e.g. #2PP
  playerName: string;
  lastSync: number;    // timestamp
}

export function loadAccount(): AccountData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AccountData) : null;
  } catch {
    return null;
  }
}

export function saveAccount(data: AccountData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearAccount(): void {
  localStorage.removeItem(KEY);
}
