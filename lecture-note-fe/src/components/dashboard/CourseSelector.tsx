import React from 'react';
import { courses, weeks } from '../../data/dashboard';

// Re-created components based on shadcn/ui look and feel using Tailwind CSS
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-gray-500 ${className}`} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

const Select = ({ value, onValueChange, children }: { value?: string, onValueChange: (value: string) => void, children: React.ReactNode }) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
    {children}
  </select>
);

const SelectTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const SelectValue = ({ placeholder }: { placeholder: string }) => <option value="" disabled>{placeholder}</option>;

const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => <option value={value}>{children}</option>;

type CourseSelectorProps = {
  selectedCourse: string | null
  onCourseChange: (courseId: string) => void
  selectedWeek: string | null
  onWeekChange: (weekId: string) => void
}

export function CourseSelector({ 
  selectedCourse, onCourseChange, selectedWeek, onWeekChange 
}: CourseSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Course</CardTitle>
        <CardDescription>
          Choose the course and week to upload notes and generate a summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <Select onValueChange={onCourseChange} value={selectedCourse ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={onWeekChange} value={selectedWeek ?? undefined} disabled={!selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Select a week..." />
            </SelectTrigger>
            <SelectContent>
              {weeks.map(week => (
                <SelectItem key={week.id} value={week.id}>
                  {week.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
