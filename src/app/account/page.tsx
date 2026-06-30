"use client";

import { useEffect, useState } from "react";
import { loadAccount, saveAccount, clearAccount } from "@/store/account";
import { saveRoster } from "@/store/roster";
import type { AccountData } from "@/store/account";
import type { Roster } from "@/types";

function parseTag(raw: string): string | null {
  const trimmed = raw.trim();
  const hashIndex = trimmed.lastIndexOf("#");
  const tag = hashIndex >= 0 ? trimmed.slice(hashIndex) : `#${trimmed}`;
  return /^#[0-9A-Z]{3,10}$/i.test(tag) ? tag.toUpperCase() : null;
}

export default function AccountPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    const saved = loadAccount();
    if (saved) { setAccount(saved); setTagInput(saved.playerTag); }
  }, []);

  function handleSaveTag() {
    const tag = parseTag(tagInput);
    if (!tag) {
      setMsg({ type: "error", text: "That doesn't look right. Your player tag starts with # and is 4–10 characters, e.g. #2PP or #ABC123. Find it in-game by tapping your profile picture." });
      return;
    }
    const data: AccountData = {
      playerTag: tag,
      playerName: account?.playerTag === tag ? (account.playerName ?? "") : "",
      lastSync: account?.playerTag === tag ? (account.lastSync ?? 0) : 0,
    };
    saveAccount(data);
    setAccount(data);
    setMsg({ type: "success", text: `Tag ${tag} saved. Tap "Sync roster" below to import your brawlers.` });
  }

  async function handleSync() {
    if (!account?.playerTag) return;
    setSyncing(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/import-roster?tag=${encodeURIComponent(account.playerTag)}`);
      const data = await res.json();
      if (!res.ok) {
        setMsg({
          type: "error",
          text: `Error ${res.status}: ${data.error ?? "Import failed"} — ${JSON.stringify(data.detail ?? "")}`,
        });
        return;
      }
      const updated: AccountData = {
        playerTag: data.playerTag,
        playerName: data.playerName,
        lastSync: Date.now(),
      };
      saveAccount(updated);
      saveRoster(data.roster as Roster);
      setAccount(updated);
      setMsg({ type: "success", text: `Synced ${Object.keys(data.roster).length} brawlers for ${data.playerName}!` });
    } catch (e) {
      setMsg({ type: "error", text: String(e) });
    } finally {
      setSyncing(false);
    }
  }

  function handleSignOut() {
    clearAccount();
    setAccount(null);
    setTagInput("");
    setMsg(null);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Account</h1>
      <p className="text-gray-400 text-sm mb-8">Link your Brawl Stars tag so the advisor knows who you are.</p>

      {/* Linked account card */}
      {account?.playerTag && (
        <div className="mb-6 rounded-2xl border border-gray-700 p-5" style={{background: "linear-gradient(135deg, #0f2040 0%, #162b4e 100%)"}}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0"
              style={{background: "linear-gradient(135deg, #FFD700, #FF8C00)"}}>
              {account.playerName ? account.playerName[0].toUpperCase() : "#"}
            </div>
            <div className="flex-1 min-w-0">
              {account.playerName
                ? <p className="font-bold text-white text-lg leading-tight">{account.playerName}</p>
                : <p className="text-gray-400 text-sm italic">Name loads after sync</p>
              }
              <p className="font-mono text-yellow-400 text-sm">{account.playerTag}</p>
              {account.lastSync > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">Last synced {new Date(account.lastSync).toLocaleString()}</p>
              )}
            </div>
            <button onClick={handleSignOut}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-400 transition-colors">
              Unlink
            </button>
          </div>

          {/* Sync button */}
          <button onClick={handleSync} disabled={syncing}
            className="mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
            style={{background: "linear-gradient(135deg, #FFD700, #FF8C00)", color: "#060e1a"}}>
            {syncing ? "Syncing roster…" : "Sync roster from Brawl Stars"}
          </button>
        </div>
      )}

      {/* Tag input */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-1">
          {account?.playerTag ? "Change tag" : "Link your Brawl Stars tag"}
        </h2>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Enter your <span className="text-yellow-400 font-semibold">in-game player tag</span> — the code starting with{" "}
          <span className="font-mono text-white">#</span> shown under your name in your profile.
          This is <strong className="text-white">not</strong> your Supercell ID username.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="#2PP"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTag()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
          />
          <button onClick={handleSaveTag}
            className="font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
            style={{background: "linear-gradient(135deg, #FFD700, #FF8C00)", color: "#060e1a"}}>
            Link
          </button>
        </div>

        {msg && (
          <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
            msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-400"
            : msg.type === "info" ? "bg-blue-500/10 border border-blue-500/30 text-blue-300"
            : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}>
            {msg.text}
          </div>
        )}
      </div>

      {/* How to find tag */}
      <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-300 mb-2">How to find your player tag</p>
        <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
          <li>Open Brawl Stars</li>
          <li>Tap your <span className="text-white">profile picture</span> (top left)</li>
          <li>Your tag is shown below your name — starts with <span className="text-yellow-400 font-mono">#</span></li>
        </ol>
        <div className="mt-3 px-3 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-xs text-yellow-300">
          <span className="font-mono">YourName#1234</span> (Supercell ID) ≠ <span className="font-mono">#2PPLVVY</span> (player tag). You need the second one.
        </div>
      </div>
    </div>
  );
}
