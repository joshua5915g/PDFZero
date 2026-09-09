"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "Computer Science I", grade: "A", credits: 4 },
    { id: "2", name: "Calculus II", grade: "B+", credits: 4 },
    { id: "3", name: "English Literature", grade: "A-", credits: 3 },
    { id: "4", name: "Physics Lab", grade: "A", credits: 2 }
  ]);

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: Math.random().toString(), name: `Course ${courses.length + 1}`, grade: "A", credits: 3 }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  };

  const { gpa, totalCredits, totalPoints } = useMemo(() => {
    let creditsSum = 0;
    let pointsSum = 0;

    courses.forEach((c) => {
      const pts = GRADE_POINTS[c.grade] ?? 4.0;
      creditsSum += c.credits;
      pointsSum += pts * c.credits;
    });

    const calculatedGpa = creditsSum > 0 ? pointsSum / creditsSum : 0;
    return {
      gpa: calculatedGpa,
      totalCredits: creditsSum,
      totalPoints: pointsSum
    };
  }, [courses]);

  return (
    <CalculatorLayout
      title="GPA Calculator"
      description="Calculate weighted and unweighted semester or cumulative Grade Point Average (GPA) on a 4.0 scale."
      iconName="GraduationCap"
      category="Calculators & Units"
      resultSummary={{
        label: "Cumulative Grade Point Average",
        value: `${gpa.toFixed(2)} / 4.00`,
        subtext: `Total Credits: ${totalCredits} | Total Quality Points: ${totalPoints.toFixed(1)}`
      }}
      breakdown={[
        { label: "Grade Standing", value: gpa >= 3.8 ? "Summa Cum Laude" : gpa >= 3.5 ? "Dean's List / Honors" : "Good Standing", color: "text-emerald-400" },
        { label: "Total Graded Courses", value: `${courses.length} Classes` },
        { label: "Total Credit Hours", value: `${totalCredits} Credits` }
      ]}
      tips={[
        "Standard 4.0 scale: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, D=1.0, F=0.0.",
        "Higher credit classes impact your GPA more heavily than 1 or 2 credit labs."
      ]}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Roster</span>
          <button
            onClick={addCourse}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Course
          </button>
        </div>

        <div className="space-y-2">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap sm:flex-nowrap items-center gap-3"
            >
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                placeholder="Course Name"
                className="flex-1 min-w-[140px] px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                  aria-label={`Grade for ${course.name || "course"}`}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm font-semibold text-purple-400 focus:outline-none"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>
                      {g} ({GRADE_POINTS[g].toFixed(1)})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, "credits", Math.max(1, Number(e.target.value)))}
                    aria-label={`Credits for ${course.name || "course"}`}
                    className="w-14 px-2 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-center text-white focus:outline-none"
                  />
                  <span>cr</span>
                </div>

                <button
                  onClick={() => removeCourse(course.id)}
                  disabled={courses.length <= 1}
                  aria-label={`Delete ${course.name || "course"}`}
                  className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CalculatorLayout>
  );
}
