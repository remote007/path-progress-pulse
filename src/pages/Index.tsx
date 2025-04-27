
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Use a longer timeout to ensure router context is fully established
    const timer = setTimeout(() => {
      navigate('/');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  // Return a simple loading state instead of null
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
};

export default Index;
