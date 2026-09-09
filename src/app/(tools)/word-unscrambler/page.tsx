"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import { Search, Sparkles, Copy, Check } from "lucide-react";

// Curated high-frequency English lexicon for instant client-side anagram matching
const COMMON_DICTIONARY = [
  "about", "after", "again", "air", "all", "along", "also", "always", "an", "and", "animal", "another", "answer", "any", "apple",
  "are", "around", "as", "ask", "at", "away", "back", "bad", "ball", "bank", "bar", "base", "be", "bear", "beat", "beauty",
  "because", "become", "bed", "been", "before", "began", "begin", "behind", "being", "believe", "bell", "best", "better", "between",
  "big", "bird", "black", "blue", "boat", "body", "book", "both", "boy", "bring", "brother", "build", "built", "burn", "business",
  "but", "buy", "by", "call", "came", "camera", "can", "car", "card", "care", "carry", "case", "cat", "catch", "cause", "center",
  "chair", "chance", "change", "charge", "check", "child", "children", "choose", "church", "circle", "city", "claim", "class",
  "clean", "clear", "climb", "clock", "close", "cloud", "coast", "cold", "color", "come", "common", "company", "compare", "complete",
  "contain", "cool", "copy", "corner", "correct", "cost", "could", "country", "course", "court", "cover", "cross", "crowd", "cry",
  "cup", "cut", "dark", "day", "dead", "deal", "dear", "death", "decide", "deep", "degree", "depend", "describe", "design", "desk",
  "develop", "die", "differ", "dinner", "direct", "discover", "distant", "divide", "do", "doctor", "does", "dog", "dollar", "done",
  "door", "down", "draw", "dream", "dress", "drink", "drive", "drop", "dry", "during", "each", "early", "earth", "east", "easy",
  "eat", "edge", "effect", "egg", "eight", "either", "electric", "element", "else", "end", "enemy", "energy", "engine", "enough",
  "enter", "equal", "equip", "even", "evening", "event", "ever", "every", "exact", "example", "except", "excite", "exercise",
  "expect", "eye", "face", "fact", "fair", "fall", "family", "famous", "far", "farm", "fast", "fat", "father", "fear", "feed",
  "feel", "feet", "few", "field", "fig", "fight", "figure", "fill", "final", "find", "fine", "finger", "finish", "fire", "first",
  "fish", "fit", "five", "flat", "floor", "flow", "flower", "fly", "follow", "food", "foot", "for", "force", "forest", "form",
  "found", "four", "free", "fresh", "friend", "from", "front", "fruit", "full", "fun", "game", "garden", "gas", "gather", "gave",
  "general", "gentle", "get", "girl", "give", "glad", "glass", "go", "gold", "gone", "good", "got", "govern", "grand", "grass",
  "gray", "great", "green", "grew", "ground", "group", "grow", "guess", "guide", "gun", "had", "hair", "half", "hand", "happen",
  "happy", "hard", "has", "hat", "have", "he", "head", "hear", "heard", "heart", "heat", "heavy", "held", "help", "her", "here",
  "hero", "high", "hill", "him", "his", "history", "hit", "hold", "hole", "home", "hope", "horse", "hot", "hour", "house", "how",
  "huge", "human", "hundred", "hunt", "hurry", "ice", "idea", "if", "imagine", "in", "inch", "include", "indicate", "industry",
  "insect", "instant", "instead", "instrument", "interest", "into", "invent", "iron", "is", "island", "issue", "it", "item",
  "job", "join", "joy", "judge", "jump", "just", "keep", "kept", "key", "kill", "kind", "king", "knew", "know", "lady", "lake",
  "land", "language", "large", "last", "late", "laugh", "law", "lay", "lead", "learn", "least", "leave", "led", "left", "leg",
  "length", "less", "lesson", "let", "letter", "level", "lie", "life", "lift", "light", "like", "line", "lion", "lip", "liquid",
  "list", "listen", "little", "live", "locate", "log", "lone", "long", "look", "loud", "love", "low", "machine", "made", "magnet",
  "main", "major", "make", "man", "many", "map", "mark", "market", "mass", "master", "match", "material", "matter", "may", "maybe",
  "me", "mean", "measure", "meat", "meet", "melody", "member", "men", "metal", "method", "middle", "might", "mile", "milk",
  "million", "mind", "mine", "minute", "miss", "mix", "modern", "molecule", "moment", "money", "month", "moon", "more", "morning",
  "most", "mother", "motion", "mount", "mountain", "mouth", "move", "much", "multiply", "music", "must", "my", "name", "nation",
  "natural", "nature", "near", "necessary", "neck", "need", "neighbor", "never", "new", "next", "night", "nine", "no", "noon",
  "nor", "north", "nose", "not", "note", "nothing", "notice", "noun", "now", "number", "numeral", "object", "observe", "occur",
  "ocean", "of", "off", "offer", "office", "often", "oil", "old", "on", "once", "one", "only", "open", "operate", "opinion",
  "opposite", "or", "order", "organ", "original", "other", "our", "out", "over", "own", "oxygen", "page", "paint", "pair",
  "paper", "paragraph", "parent", "part", "particular", "party", "pass", "past", "path", "pattern", "pay", "people", "per",
  "perfect", "period", "person", "phrase", "pick", "picture", "piece", "pitch", "place", "plain", "plan", "plane", "planet",
  "plant", "play", "please", "plural", "poem", "point", "poor", "populate", "port", "pose", "position", "possible", "post",
  "pound", "power", "practice", "prepare", "present", "press", "pretty", "print", "probable", "problem", "process", "produce",
  "product", "program", "proper", "property", "protect", "prove", "provide", "pull", "pure", "push", "put", "quart", "question",
  "quick", "quiet", "quite", "race", "radio", "rail", "rain", "raise", "ran", "range", "rather", "reach", "read", "ready",
  "real", "reason", "receive", "record", "red", "region", "repeat", "reply", "require", "rest", "result", "rich", "ride", "right",
  "ring", "river", "road", "rock", "roll", "room", "root", "rope", "rose", "round", "row", "rub", "rule", "run", "safe", "said",
  "sail", "salt", "same", "sand", "sat", "save", "saw", "say", "scale", "school", "science", "score", "sea", "search", "season",
  "seat", "second", "section", "see", "seed", "seem", "segment", "select", "self", "sell", "send", "sense", "sent", "sentence",
  "separate", "serve", "set", "settle", "seven", "several", "shall", "shape", "share", "sharp", "she", "sheet", "shell", "shine",
  "ship", "shirt", "shoe", "shoot", "shop", "shore", "short", "should", "shoulder", "shout", "show", "side", "sight", "sign",
  "signal", "silent", "silver", "similar", "simple", "since", "sing", "single", "sister", "sit", "six", "size", "skill", "skin",
  "sky", "slave", "sleep", "slip", "slow", "small", "smell", "smile", "smoke", "snow", "so", "soft", "soil", "soldier", "solution",
  "solve", "some", "son", "song", "soon", "sound", "south", "space", "speak", "special", "speed", "spell", "spend", "spoke",
  "spot", "spread", "spring", "square", "stand", "star", "start", "state", "station", "stay", "stead", "steam", "steel", "step",
  "stick", "still", "stone", "stood", "stop", "store", "story", "straight", "strange", "stream", "street", "stretch", "string",
  "strong", "student", "study", "subject", "substance", "such", "sudden", "suffix", "sugar", "suggest", "suit", "summer", "sun",
  "supply", "support", "sure", "surface", "surprise", "swim", "syllable", "symbol", "system", "table", "tail", "take", "talk",
  "tall", "teach", "team", "tell", "temperature", "ten", "term", "test", "than", "thank", "that", "the", "their", "them",
  "then", "there", "these", "they", "thick", "thin", "thing", "think", "third", "this", "those", "though", "thought", "thousand",
  "three", "through", "throw", "thus", "tie", "time", "tiny", "tire", "to", "together", "told", "tone", "too", "took", "tool",
  "top", "total", "touch", "toward", "town", "track", "trade", "train", "travel", "tree", "triangle", "trip", "trouble", "truck",
  "true", "try", "tube", "turn", "twenty", "two", "type", "under", "understand", "unit", "until", "up", "upon", "us", "use",
  "usual", "valley", "value", "vary", "verb", "very", "view", "village", "visit", "voice", "vowel", "wait", "walk", "wall",
  "want", "war", "warm", "was", "wash", "watch", "water", "wave", "way", "we", "wear", "weather", "week", "weight", "welcome",
  "well", "went", "were", "west", "what", "wheel", "when", "where", "whether", "which", "while", "white", "who", "whole",
  "whose", "why", "wide", "wife", "wild", "will", "win", "wind", "window", "wing", "winter", "wire", "wish", "with", "without",
  "woman", "women", "wonder", "wood", "word", "work", "world", "would", "write", "written", "wrong", "wrote", "yard", "year",
  "yellow", "yes", "yet", "you", "young", "your"
];

export default function WordUnscrambler() {
  const [letters, setLetters] = useState("aeplep");
  const [startsWith, setStartsWith] = useState("");
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  // Helper to count letter frequencies
  const getFreq = (str: string) => {
    const f: Record<string, number> = {};
    for (const c of str.toLowerCase().replace(/[^a-z]/g, "")) {
      f[c] = (f[c] || 0) + 1;
    }
    return f;
  };

  const matches = useMemo(() => {
    const cleanInput = letters.toLowerCase().replace(/[^a-z]/g, "");
    if (!cleanInput) return [];

    const inputFreq = getFreq(cleanInput);

    const validWords = COMMON_DICTIONARY.filter((word) => {
      if (startsWith && !word.startsWith(startsWith.toLowerCase())) return false;
      const wFreq = getFreq(word);
      for (const char in wFreq) {
        if (!inputFreq[char] || wFreq[char] > inputFreq[char]) {
          return false;
        }
      }
      return true;
    });

    // Sort by length descending, then alphabetically
    return validWords.sort((a, b) => b.length - a.length || a.localeCompare(b));
  }, [letters, startsWith]);

  const copy = (w: string) => {
    navigator.clipboard.writeText(w);
    setCopiedWord(w);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <CalculatorLayout
      title="Word Unscrambler & Anagram Solver"
      description="Unscramble letters, find hidden anagrams, and generate high-scoring words for Scrabble, Wordle, and Boggle."
      iconName="Search"
      category="Calculators & Units"
      resultSummary={{
        label: `Found ${matches.length} Valid Words`,
        value: matches[0] ? matches[0].toUpperCase() : "None",
        subtext: `Longest match length: ${matches[0] ? matches[0].length : 0} letters`
      }}
      breakdown={[
        { label: "Letters Entered", value: letters.toUpperCase() },
        { label: "Top Unscrambled Match", value: matches[0] || "—", color: "text-emerald-400" },
        { label: "Total Matches", value: `${matches.length} words` }
      ]}
      tips={[
        "Enter any jumbled letters without spaces or punctuation.",
        "Use 'Starts With' to filter for crossword puzzle or Scrabble board constraints."
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Scrambled Letters
            </label>
            <input
              type="text"
              value={letters}
              onChange={(e) => setLetters(e.target.value)}
              placeholder="e.g. roact"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-bold uppercase tracking-widest text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Starts With (Optional)
            </label>
            <input
              type="text"
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value)}
              placeholder="e.g. a"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base font-bold text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Word Results Categorized by Length */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Unscrambled Matches ({matches.length})
          </div>

          <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            {matches.map((w) => (
              <button
                key={w}
                onClick={() => copy(w)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-600/20 border border-slate-700/60 hover:border-purple-500 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all group"
              >
                <span>{w}</span>
                <span className="text-[10px] text-purple-400 font-mono">({w.length})</span>
                {copiedWord === w ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 group-hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
            {matches.length === 0 && (
              <div className="text-sm text-slate-500 italic p-4 text-center w-full">
                No anagram matches found for these letters.
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
