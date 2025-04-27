
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Use a small timeout to ensure router context is established
    const timer = setTimeout(() => {
      navigate('/');
    }, 10);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

export default Index;
