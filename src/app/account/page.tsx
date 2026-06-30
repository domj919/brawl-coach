"use client";

import { useEffect, useState } from "react";
import { loadAccount, saveAccount, clearAccount } from "@/store/account";
import { saveRoster } from "@/store/roster";
import type { AccountData } from "@/store/account";
import type { Roster } from "@/types";

export default function AccountPage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const saved = loadAccount();
    if (saved) { setAccount(saved); setTagInput(saved.playerTag); }
  }, []);

  async function handleSync(rawInput?: string) {
    const raw = (rawInput ?? tagInput).trim();
    if (!raw) return;

    // Strip any "Name#" prefix — user might paste their Supercell ID
    // Brawl Stars player tags are ONLY the "#XXXXXXX" part
    const hashIndex = raw.lastIndexOf("#");
    const tag = hashIndex >= 0 ? raw.slice(hashIndex) : `#${raw}`;

    if (!/^#[0-9A-Z]+$/i.test(tag)) {
      setMsg({
        type: "error",
        text: "That doesn't look like a Brawl Stars player tag. Find yours in-game: tap your profile → copy the tag under your name (e.g. #2PP). It is NOT your Supercell ID username.",
      });
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/import-roster?tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      if (!res.ok) {
        const isIpError = res.status === 403;
        setMsg({
          type: "error",
          text: isIpError
            ? "API access denied (403). Your API key is IP-locked to your home IP — it won't work on the live site. Go to developer.brawlstars.com → edit your key → add Vercel's IPs or set 0.0.0.0/0 to allow all."
            : `Error: ${data.error ?? "Import failed"}`,
        });
        return;
      }
      const newAccount: AccountData = {
        playerTag: data.playerTag,
        playerName: data.playerName,
        lastSync: Date.now(),
      };
      saveAccount(newAccount);
      saveRoster(data.roster as Roster);
      setAccount(newAccount);
      setTagInput(data.playerTag);
      setMsg({ type: "success", text: `Synced ${Object.keys(data.roster).length} brawlers for ${data.playerName}` });
    } catch (e) {
      setMsg({ type: "error", text: String(e) });
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    clearAccount();
    setAccount(null);
    setTagInput("");
    setMsg(null);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Account</h1>
      <p className="text-gray-400 text-sm mb-8">
        Link your Brawl Stars account to auto-import your roster.
      </p>

      {/* Signed in state */}
      {account && (
        <div className="mb-6 bg-gray-900 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-extrabold shrink-0"
            style={{background: "linear-gradient(135deg, #fbbf24, #f97316)", color: "#06030f"}}>
            {account.playerName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">{account.playerName}</p>
            <p className="text-xs text-gray-400">{account.playerTag}</p>
            <p className="text-xs text-gray-500">Last synced {new Date(account.lastSync).toLocaleString()}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSync(account.playerTag)} disabled={loading}
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Syncing…" : "Re-sync"}
            </button>
            <button onClick={handleSignOut}
              className="text-xs px-3 py-1.5 bg-red-900/40 hover:bg-red-900/70 text-red-400 rounded-lg transition-colors">
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Tag input */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
        <h2 className="font-semibold text-white mb-1">{account ? "Change account" : "Link your account"}</h2>
        <p className="text-xs text-gray-400 mb-4">
          Enter your <span className="text-yellow-400 font-semibold">Brawl Stars player tag</span> — not your Supercell ID username.
          Find it in-game by tapping your profile picture. It looks like <span className="text-white font-mono">#2PP</span> or <span className="text-white font-mono">#ABC123</span>.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="#2PP"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSync()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
          />
          <button onClick={() => handleSync()} disabled={loading}
            className="font-bold px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 disabled:opacity-50"
            style={{background: "linear-gradient(135deg, #fbbf24, #f97316)", color: "#06030f"}}>
            {loading ? "Loading…" : "Import"}
          </button>
        </div>

        {msg && (
          <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${msg.type === "success" ? "bg-green-500/10 border border-green-500/30 text-green-400" : "bg-red-500/10 border border-red-500/30 text-red-300"}`}>
            {msg.text}
          </div>
        )}
      </div>

      {/* Help */}
      <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">How to find your player tag</h3>
        <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
          <li>Open Brawl Stars on your device</li>
          <li>Tap your <span className="text-white">profile picture</span> in the top left</li>
          <li>Your tag is shown below your name — it starts with <span className="text-yellow-400 font-mono">#</span></li>
          <li>Copy and paste it here</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-xs text-yellow-300">
          ⚠ Your Supercell ID (e.g. <span className="font-mono">YourName#1234</span>) is <strong>not</strong> the same as your player tag. The player tag is a shorter code like <span className="font-mono">#2PPLVVY</span>.
        </div>
      </div>
    </div>
  );
}
