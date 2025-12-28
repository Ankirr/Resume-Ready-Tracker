
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Home, 
  List, 
  User, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const navigationItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Internships', icon: Briefcase, path: '/internships' },
    { name: 'Projects', icon: List, path: '/projects' },
    { name: 'Resume', icon: FileText, path: '/resume' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-50"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          !isMobile && "relative translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="px-6 py-4 h-16 flex items-center border-b border-sidebar-border">
          <h1 className="text-xl font-bold">Career Tracker</h1>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
          <div className="text-sm text-sidebar-foreground/70">
            &copy; 2024 Career Tracker
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
