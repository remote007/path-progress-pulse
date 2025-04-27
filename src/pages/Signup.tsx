
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as 'admin' | 'learner'
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Create new user
      const newUser = {
        id: `user${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role as 'admin' | 'learner',
        interests: [],
        weeklyTime: 0,
        progress: {},
        xp: 0,
        badges: []
      };
      
      login(newUser);
      
      toast({
        title: 'Account created!',
        description: 'Welcome to PathPulse! Set up your profile to get started.',
      });
      
      // Navigate based on role
      if (formData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/profile-setup');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email" 
                placeholder="name@example.com"
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
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="learner">Learner</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
