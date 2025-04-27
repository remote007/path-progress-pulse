
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useUserStore } from '@/stores/userStore';

const interests = [
  { id: 'web-dev', label: 'Web Development' },
  { id: 'mobile-dev', label: 'Mobile Development' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'ui-ux', label: 'UI/UX Design' },
  { id: 'devops', label: 'DevOps' },
  { id: 'cybersecurity', label: 'Cybersecurity' }
];

const ProfileSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, login } = useUserStore();
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [learningGoal, setLearningGoal] = useState('');
  const [weeklyTime, setWeeklyTime] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedInterests.length === 0) {
      toast({
        title: 'Select interests',
        description: 'Please select at least one interest.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!learningGoal) {
      toast({
        title: 'Set a learning goal',
        description: 'Please set a learning goal to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Update user profile
      if (user) {
        const updatedUser = {
          ...user,
          interests: selectedInterests,
          learningGoal,
          weeklyTime
        };
        
        login(updatedUser);
        
        toast({
          title: 'Profile set up!',
          description: 'Your learning journey begins now!',
        });
        
        navigate('/dashboard');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  if (!user) {
    // Redirect if not logged in
    navigate('/login');
    return null;
  }
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set Up Your Learning Profile</CardTitle>
          <CardDescription className="text-center">
            Help us personalize your learning journey
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Your Interests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interests.map(interest => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={interest.id}
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                    />
                    <Label htmlFor={interest.id} className="cursor-pointer">
                      {interest.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Your Learning Goal</Label>
              <Input 
                id="goal"
                placeholder="e.g., Become a full-stack developer"
                value={learningGoal}
                onChange={e => setLearningGoal(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Weekly Time Commitment (hours)</Label>
              <Input 
                id="time"
                type="number"
                min={1}
                max={40} 
                value={weeklyTime}
                onChange={e => setWeeklyTime(Number(e.target.value))}
                required
              />
              <p className="text-sm text-muted-foreground">
                How many hours can you commit to learning each week?
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Start My Learning Journey'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSetup;
