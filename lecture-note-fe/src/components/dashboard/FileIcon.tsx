import { FileText, FileArchive, File as FileIconLucide } from 'lucide-react'
import type { Note } from '../../data/dashboard'

export function FileIcon({ type, className }: { type: Note['type'], className?: string }) {
  const baseClass = "h-6 w-6 text-gray-500"
  const finalClassName = `${baseClass} ${className || ''}`.trim()
  
  switch (type) {
    case 'PDF':
      return <FileText className={finalClassName} />
    case 'DOCX':
      return <FileArchive className={finalClassName} />
    case 'TXT':
      return <FileIconLucide className={finalClassName} />
    default:
      return <FileIconLucide className={finalClassName} />
  }
}
