"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Heart, Repeat2, MessageCircle, Bookmark, Share, BadgeCheck, Image as ImageIcon } from "lucide-react";

export default function TweetPreviewerPage() {
  const [displayName, setDisplayName] = useState("Alex Rivera");
  const [handle, setHandle] = useState("alexrivera_dev");
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80");
  const [tweetText, setTweetText] = useState("Shipping client-side web tools with zero server bills feels like having a real superpower. Fast, private, and free forever! 🚀✨");
  const [mediaUrl, setMediaUrl] = useState("");
  const [verified, setVerified] = useState(true);
  const [likes, setLikes] = useState(1420);
  const [retweets, setRetweets] = useState(380);
  const [replies, setReplies] = useState(84);
  const [views, setViews] = useState("45.2K");
  const [theme, setTheme] = useState<"dark" | "dim" | "light">("dark");

  const themeClasses = {
    dark: "bg-black text-white border-slate-800",
    dim: "bg-[#15202b] text-white border-[#38444d]",
    light: "bg-white text-slate-900 border-slate-200"
  }[theme];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Share2 className="w-3.5 h-3.5" />
            Business & Marketing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tweet & X Post Mockup Generator
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Create pixel-perfect Twitter/X social post mockups for presentations, pitch decks, and ads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex gap-2">
                {(["dark", "dim", "light"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      theme === t ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    {t} Theme
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Username Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Tweet Text Content</label>
                <textarea
                  rows={4}
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Attached Media URL (Optional)</label>
                <input
                  type="url"
                  value={mediaUrl}
                  placeholder="https://... (leave empty for none)"
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Replies</label>
                  <input
                    type="number"
                    value={replies}
                    onChange={(e) => setReplies(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Retweets</label>
                  <input
                    type="number"
                    value={retweets}
                    onChange={(e) => setRetweets(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Likes</label>
                  <input
                    type="number"
                    value={likes}
                    onChange={(e) => setLikes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span>Blue Verified Badge</span>
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 max-w-lg mx-auto w-full font-sans ${themeClasses}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar} alt={displayName} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center gap-1 font-bold text-base leading-tight">
                      <span>{displayName}</span>
                      {verified && <BadgeCheck className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0]" />}
                    </div>
                    <div className="text-xs text-slate-500">@{handle}</div>
                  </div>
                </div>
                <div className="text-slate-500 text-lg font-bold select-none cursor-pointer">···</div>
              </div>

              <div className="text-base leading-normal whitespace-pre-wrap">{tweetText}</div>

              {mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-72">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl} alt="Attached media" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="text-xs text-slate-500 border-b border-slate-800/60 pb-3 flex items-center gap-2">
                <span>10:42 AM · Sep 9, 2026</span>
                <span>·</span>
                <span className="font-bold text-slate-300">{views}</span> Views
              </div>

              {/* Action Icons */}
              <div className="flex items-center justify-between text-slate-500 text-xs pt-1 px-1">
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <MessageCircle className="w-4 h-4" />
                  <span>{replies}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-emerald-500">
                  <Repeat2 className="w-4 h-4" />
                  <span>{retweets}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-pink-500">
                  <Heart className="w-4 h-4" />
                  <span>{likes}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5 hover:text-[#1d9bf0]">
                  <Share className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
