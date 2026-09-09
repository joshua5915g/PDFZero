"use client";

import React, { useState } from "react";
import DocGeneratorLayout from "@/components/tools/DocGeneratorLayout";
import { Plus, Trash2 } from "lucide-react";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  details: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState("Alex Morgan");
  const [jobTitle, setJobTitle] = useState("Senior Full-Stack Software Engineer");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [location, setLocation] = useState("San Francisco, CA");
  const [website, setWebsite] = useState("github.com/alexmorgan");
  
  const [summary, setSummary] = useState(
    "High-impact software engineer with 6+ years of experience building fault-tolerant cloud architectures, edge web applications, and intuitive user interfaces. Passionate about developer tooling, performance, and clean code."
  );

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      role: "Lead Frontend Architect",
      company: "Starlight Technologies",
      period: "2022 - Present",
      details: "• Spearheaded migration to Next.js App Router, cutting LCP load time by 42% across 1M monthly active users.\n• Mentored a team of 8 frontend engineers and established repository-wide TypeScript and testing standards."
    },
    {
      id: "2",
      role: "Full Stack Engineer",
      company: "VentureCloud Labs",
      period: "2019 - 2022",
      details: "• Engineered distributed real-time collaborative document editor using WebSockets and client-side CRDTs.\n• Designed REST and GraphQL backend services supporting 50k requests/second."
    }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      year: "2015 - 2019"
    }
  ]);

  const [skills, setSkills] = useState("TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Docker, AWS, Tailwind CSS, GraphQL, WebAssembly");

  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      { id: Date.now().toString(), role: "Role Title", company: "Company", period: "2020 - 2022", details: "• Key achievements and responsibilities" }
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DocGeneratorLayout
      title="Resume Builder"
      description="Design ATS-friendly, clean single-page resumes with real-time typography preview. Download as vector PDF."
      iconName="FileBadge"
      category="Business & Marketing"
      onDownloadPdf={handlePrint}
      onPrint={handlePrint}
      tips={[
        "ATS-friendly clean layout tested with applicant tracking parsers.",
        "Click Download PDF to export as a sharp, unwatermarked single-page document.",
        "Your private career data never touches a server."
      ]}
      formControls={
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <span className="font-bold text-slate-200">Personal Info</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Target Role / Headline"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
              />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Portfolio / LinkedIn"
                className="bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Executive Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white resize-none"
            />
          </div>

          {/* Work Experience */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200">Work Experience</span>
              <button
                onClick={addExperience}
                className="px-2 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Job
              </button>
            </div>

            {experiences.map((exp) => (
              <div key={exp.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, role: e.target.value } : x))}
                    placeholder="Role"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x))}
                    placeholder="Company"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                  />
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, period: e.target.value } : x))}
                  placeholder="Date Range (e.g. 2021 - Present)"
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                />
                <textarea
                  rows={3}
                  value={exp.details}
                  onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, details: e.target.value } : x))}
                  placeholder="Bullet points of impact..."
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-mono text-[11px] resize-none"
                />
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Skills (Comma-separated)</label>
            <textarea
              rows={2}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white resize-none"
            />
          </div>
        </div>
      }
      previewNode={
        <div className="space-y-6 text-slate-800 max-w-2xl mx-auto font-sans text-xs">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">{fullName}</h2>
            <h4 className="text-sm font-semibold text-blue-700 mt-0.5">{jobTitle}</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2 font-medium">
              <span>{email}</span>
              <span>•</span>
              <span>{phone}</span>
              <span>•</span>
              <span>{location}</span>
              <span>•</span>
              <span className="text-slate-900">{website}</span>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="space-y-1">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px]">Professional Summary</h5>
              <p className="text-slate-600 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-4">
            <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Experience
            </h5>
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[12px]">{exp.role} <span className="font-normal text-slate-600">at {exp.company}</span></span>
                  <span className="text-slate-500 font-mono text-[10px]">{exp.period}</span>
                </div>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed pl-2">{exp.details}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Education
            </h5>
            {educations.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <p className="text-slate-600">{edu.school}</p>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">{edu.year}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          {skills && (
            <div className="space-y-1.5 pt-2">
              <h5 className="font-bold text-slate-950 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                Technical Skills & Competencies
              </h5>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.split(",").map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded text-[10px] font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
