
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-xl">Path<span className="text-secondary">Pulse</span></span>
            </Link>
          </div>
          
          <div className="mt-8 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-6">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                About
              </span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                Contact
              </span>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer">
                Privacy
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} PathPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
