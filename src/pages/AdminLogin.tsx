
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { users } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUserStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const { email, password } = formData;
      
      // Find admin user
      const user = users.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password &&
        user.role === 'admin'
      );
      
      if (user) {
        // Omit password from stored user data
        const { password, ...safeUser } = user;
        
        login(safeUser as any);
        
        toast({
          title: 'Login successful!',
          description: `Welcome to the admin dashboard, ${user.name}!`,
        });
        
        navigate('/admin-dashboard');
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login to Admin'}
            </Button>
            
            <div className="text-center text-sm">
              Not an admin?{' '}
              <Link to="/login" className="text-primary hover:underline">
                User Login
              </Link>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              <p>Demo admin credentials:</p>
              <p>admin@pathpulse.com / admin123</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
