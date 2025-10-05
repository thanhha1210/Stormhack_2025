import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Home, Settings, User, LogOut, PanelLeft } from 'lucide-react';

const Logo = ({ className }: { className?: string }) => (
    <div className={`text-2xl font-bold ${className}`}>NoteFusion</div>
);

const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
);

const AvatarImage = ({ src, alt }: { src: string, alt: string }) => (
    <img src={src} alt={alt} className="aspect-square h-full w-full" />
);

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">{children}</span>
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => (
    <button ref={ref} className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
));
Button.displayName = 'Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-100/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-white sm:flex">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900">
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900">
              <Book className="h-4 w-4" />
              My Courses
            </Link>
            <Link to="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">Alex Thompson</span>
                    <span className="text-xs text-gray-500">alex.t@example.com</span>
                </div>
            </div>
            <Link to="/login">
                <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-12 mt-2">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                </Button>
            </Link>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}
