
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';

const Navbar = () => {
  const { user, logout } = useUserStore();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check for dark mode preference
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkModePreference);
    
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">Path<span className="text-secondary">Pulse</span></span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {!user && (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
              
              {user && (
                <>
                  <Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}>
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" onClick={logout}>Logout</Button>
                </>
              )}
              
              <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="mr-2">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!user && (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10">
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10">
                  Sign Up
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10">
                  Dashboard
                </Link>
                <button onClick={logout} 
                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
