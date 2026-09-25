"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Gamepad2 } from "lucide-react";

type Board = number[][];

export default function Game2048() {
  const getEmptyBoard = (): Board => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const addRandomTile = (board: Board): Board => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return board;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const initializeGame = (): Board => {
    let b = getEmptyBoard();
    b = addRandomTile(b);
    b = addRandomTile(b);
    return b;
  };

  const [board, setBoard] = useState<Board>(getEmptyBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setBoard(initializeGame());
    const saved = localStorage.getItem("pdfzero_2048_best");
    if (saved) setBestScore(parseInt(saved) || 0);
  }, []);

  const slideRow = (row: number[]): { newRow: number[]; points: number } => {
    let filtered = row.filter((val) => val !== 0);
    let points = 0;
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        points += filtered[i];
        filtered[i + 1] = 0;
      }
    }
    filtered = filtered.filter((val) => val !== 0);
    while (filtered.length < 4) {
      filtered.push(0);
    }
    return { newRow: filtered, points };
  };

  const moveLeft = (b: Board): { newBoard: Board; points: number; moved: boolean } => {
    let totalPoints = 0;
    let moved = false;
    const newBoard = b.map((row) => {
      const { newRow, points } = slideRow(row);
      totalPoints += points;
      if (row.some((val, idx) => val !== newRow[idx])) moved = true;
      return newRow;
    });
    return { newBoard, points: totalPoints, moved };
  };

  const rotateClockwise = (b: Board): Board => {
    const result = getEmptyBoard();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[c][3 - r] = b[r][c];
      }
    }
    return result;
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;
      let rotated = board;
      let rotations = 0;

      if (e.key === "ArrowLeft" || e.key === "a") {
        rotations = 0;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        rotations = 1;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        rotations = 2;
      } else if (e.key === "ArrowUp" || e.key === "w") {
        rotations = 3;
      } else {
        return;
      }

      e.preventDefault();

      for (let i = 0; i < rotations; i++) {
        rotated = rotateClockwise(rotated);
      }

      const { newBoard, points, moved } = moveLeft(rotated);

      let finalBoard = newBoard;
      for (let i = 0; i < (4 - rotations) % 4; i++) {
        finalBoard = rotateClockwise(finalBoard);
      }

      if (moved) {
        const boardWithTile = addRandomTile(finalBoard);
        setBoard(boardWithTile);
        const nextScore = score + points;
        setScore(nextScore);
        if (nextScore > bestScore) {
          setBestScore(nextScore);
          localStorage.setItem("pdfzero_2048_best", nextScore.toString());
        }
      }
    },
    [board, gameOver, score, bestScore]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const restart = () => {
    setBoard(initializeGame());
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return "bg-slate-800 text-slate-200";
      case 4: return "bg-slate-700 text-white";
      case 8: return "bg-amber-600 text-white";
      case 16: return "bg-orange-600 text-white";
      case 32: return "bg-rose-600 text-white";
      case 64: return "bg-red-600 text-white";
      case 128: return "bg-yellow-500 text-slate-950 font-black shadow-lg shadow-yellow-500/20";
      case 256: return "bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-400/30";
      case 512: return "bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/30";
      case 1024: return "bg-blue-500 text-white font-black shadow-lg shadow-blue-500/40";
      case 2048: return "bg-purple-600 text-white font-black shadow-xl shadow-purple-600/50";
      default: return "bg-slate-900/60 text-transparent";
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-pink-400 transition-colors gap-2 group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Design & Web Fun</span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-300 border border-pink-500/20">
          <Sparkles className="size-3" />
          Offline Play
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Gamepad2 className="size-7 text-pink-400" /> 2048
          </h1>
          <p className="text-xs text-slate-400">Join the numbers and reach the 2048 tile!</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] uppercase font-bold text-slate-500 block">Score</span>
            <span className="font-mono text-sm font-bold text-white">{score}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[9px] uppercase font-bold text-amber-500 block flex items-center gap-0.5 justify-center">
              <Trophy className="size-2.5" /> Best
            </span>
            <span className="font-mono text-sm font-bold text-amber-400">{bestScore}</span>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Use Arrow keys or W, A, S, D</span>
        <button
          onClick={restart}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
        >
          <RotateCcw className="size-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* 4x4 Grid Board */}
      <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-4 gap-3">
          {board.flatMap((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`size-18 sm:size-20 rounded-2xl flex items-center justify-center font-bold text-xl sm:text-2xl transition-all duration-100 ${getTileColor(
                  val
                )}`}
              >
                {val > 0 ? val : ""}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Touch Directional Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-2 sm:hidden">
        <div />
        <button
          onClick={() => handleKeyDown({ key: "ArrowUp", preventDefault: () => {} } as any)}
          className="p-3 bg-slate-800 text-white rounded-xl font-bold active:bg-slate-700 text-center"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => handleKeyDown({ key: "ArrowLeft", preventDefault: () => {} } as any)}
          className="p-3 bg-slate-800 text-white rounded-xl font-bold active:bg-slate-700 text-center"
        >
          ←
        </button>
        <button
          onClick={() => handleKeyDown({ key: "ArrowDown", preventDefault: () => {} } as any)}
          className="p-3 bg-slate-800 text-white rounded-xl font-bold active:bg-slate-700 text-center"
        >
          ↓
        </button>
        <button
          onClick={() => handleKeyDown({ key: "ArrowRight", preventDefault: () => {} } as any)}
          className="p-3 bg-slate-800 text-white rounded-xl font-bold active:bg-slate-700 text-center"
        >
          →
        </button>
      </div>
    </div>
  );
}
