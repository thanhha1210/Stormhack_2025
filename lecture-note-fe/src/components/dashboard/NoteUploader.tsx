import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import type { Note } from '../../data/dashboard';
import { FileIcon } from './FileIcon';

// Re-created components based on shadcn/ui look and feel using Tailwind CSS
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
  <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 px-4 py-2 ${className}`} {...props} />
));
Button.displayName = 'Button';

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

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`relative overflow-hidden ${className}`} {...props} />
));
ScrollArea.displayName = 'ScrollArea';

type NoteUploaderProps = {
  onSubmit: () => void;
  isSubmitting: boolean;
  files: Note[];
  setFiles: React.Dispatch<React.SetStateAction<Note[]>>;
};

export function NoteUploader({ onSubmit, isSubmitting, files, setFiles }: NoteUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newNotes: Note[] = acceptedFiles.map(file => {
      const type = file.name.split('.').pop()?.toUpperCase();
      return {
        name: file.name,
        type: type === 'PDF' || type === 'DOCX' || type === 'TXT' ? type : 'TXT',
        size: `${(file.size / 1024).toFixed(2)} KB`,
      };
    });
    setFiles(prev => [...prev, ...newNotes]);
  }, [setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Notes</CardTitle>
        <CardDescription>
          Drag and drop your weekly notes here. Supports PDF, DOCX, and TXT files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-500/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <UploadCloud className="h-10 w-10" />
            <p className="font-semibold">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files or click to browse'}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Uploaded Files</h3>
            <ScrollArea className="h-48 rounded-md border">
              <div className="p-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-100">
                    <div className="flex items-center gap-3">
                      <FileIcon type={file.type} />
                      <div>
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file.name)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
             <Button 
              onClick={onSubmit} 
              disabled={isSubmitting || files.length === 0} 
              className="w-full bg-blue-600 text-white hover:bg-blue-600/90"
            >
              Merge & Summarize Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
