import React, { useState, useTransition, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CourseSelector } from '../components/dashboard/CourseSelector';
import { NoteUploader } from '../components/dashboard/NoteUploader';
import { SummaryDisplay } from '../components/dashboard/SummaryDisplay';
import type { Note } from '../data/dashboard';
import { courses, weeks, MOCK_NOTES_CONTENT } from '../data/dashboard';

type WorkflowStep = 'select' | 'upload' | 'summarize' | 'display';

type SummaryResult = {
  summary: string | null;
  keywords: string[] | null;
  error?: string;
};

export default function DashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [step, setStep] = useState<WorkflowStep>('select');
  const [files, setFiles] = useState<Note[]>([]);
  const [summaryResult, setSummaryResult] = useState<SummaryResult>({ summary: null, keywords: null });
  const [isPending, startTransition] = useTransition();

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedWeek(null);
    setStep('select');
    setFiles([]);
  };

  const handleWeekChange = (weekId: string) => {
    setSelectedWeek(weekId);
    setStep('upload');
    setFiles([]);
  };

  const handleSummarize = () => {
    if (!selectedCourse || !selectedWeek) return;

    startTransition(() => {
      setStep('summarize');
      // Simulate API call for summarization
      setTimeout(() => {
        // Mock summary generation
        const summary = `This is a mock summary for ${courses.find(c => c.id === selectedCourse)?.name} - ${weeks.find(w => w.id === selectedWeek)?.name}.

${MOCK_NOTES_CONTENT.substring(0, 500)}...`;
        const keywords = ['Quantum Mechanics', 'Wave-Particle Duality', 'Schrödinger Equation', 'Uncertainty Principle'];
        setSummaryResult({ summary, keywords });
        setStep('display');
      }, 2000);
    });
  };

  const courseName = courses.find(c => c.id === selectedCourse)?.name;
  const weekName = weeks.find(w => w.id === selectedWeek)?.name;

  return (
    <DashboardLayout>
      <div className="grid gap-8">
        <CourseSelector 
          selectedCourse={selectedCourse} 
          onCourseChange={handleCourseChange}
          selectedWeek={selectedWeek}
          onWeekChange={handleWeekChange}
        />

        {step === 'upload' && (
          <NoteUploader 
            onSubmit={handleSummarize} 
            isSubmitting={isPending}
            files={files}
            setFiles={setFiles}
          />
        )}

        {(step === 'summarize' || step === 'display') && (
          <SummaryDisplay 
            isLoading={isPending || step === 'summarize'}
            summary={summaryResult.summary}
            keywords={summaryResult.keywords}
            courseName={courseName}
            weekName={weekName}
          />
        )}
      </div>
    </DashboardLayout>
  );
}