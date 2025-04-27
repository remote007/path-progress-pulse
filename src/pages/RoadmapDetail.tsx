
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { roadmaps } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';
import StepCard from '@/components/roadmap/StepCard';
import { checkForNewBadges } from '@/utils/badgeSystem';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, login } = useUserStore();
  
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any>({
    completedSteps: [],
    inProgressSteps: []
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const foundRoadmap = roadmaps.find(r => r.id === id);
    
    if (!foundRoadmap) {
      navigate('/dashboard');
      return;
    }
    
    // Load user progress
    const progress = user.progress?.[id as string] || {
      completedSteps: [],
      inProgressSteps: []
    };
    
    setRoadmap(foundRoadmap);
    setUserProgress(progress);
    setLoading(false);
  }, [id, user, navigate]);
  
  const markStepStatus = (stepId: string, status: 'inProgress' | 'completed') => {
    if (!user) return;

    let newCompletedSteps = [...userProgress.completedSteps];
    let newInProgressSteps = [...userProgress.inProgressSteps];
    
    if (status === 'inProgress') {
      if (!newInProgressSteps.includes(stepId)) {
        newInProgressSteps.push(stepId);
      }
      // Remove from completed if it was there
      newCompletedSteps = newCompletedSteps.filter(id => id !== stepId);
    } else {
      if (!newCompletedSteps.includes(stepId)) {
        newCompletedSteps.push(stepId);
        // Award XP when completing a step (50 XP per step)
        const updatedUser = {
          ...user,
          xp: (user?.xp || 0) + 50
        };
        login(updatedUser);
        
        toast({
          title: 'Step completed!',
          description: 'You earned 50 XP!',
        });
        
        // Check for new badges
        checkForNewBadges(updatedUser, toast, login);
      }
      // Remove from inProgress if it was there
      newInProgressSteps = newInProgressSteps.filter(id => id !== stepId);
    }
    
    // Update local state
    setUserProgress({
      completedSteps: newCompletedSteps,
      inProgressSteps: newInProgressSteps
    });
    
    // Update user progress in store
    if (user) {
      const updatedProgress = {
        ...user.progress,
        [id as string]: {
          completedSteps: newCompletedSteps,
          inProgressSteps: newInProgressSteps
        }
      };
      
      const updatedUser = {
        ...user,
        progress: updatedProgress
      };
      
      login(updatedUser);
      
      // After updating progress, check if user earned any new badges
      if (status === 'completed') {
        setTimeout(() => {
          checkForNewBadges(updatedUser, toast, login);
        }, 300);
      }
    }
  };
  
  const getStepStatus = (stepId: string) => {
    if (userProgress.completedSteps.includes(stepId)) {
      return 'completed';
    }
    if (userProgress.inProgressSteps.includes(stepId)) {
      return 'inProgress';
    }
    return 'notStarted';
  };
  
  const calculateProgress = () => {
    if (!roadmap) return 0;
    const totalSteps = roadmap.steps.length;
    const completedSteps = userProgress.completedSteps.length;
    return Math.round((completedSteps / totalSteps) * 100);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading roadmap...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="grid gap-6">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{roadmap.title}</h1>
              <p className="text-muted-foreground">
                {roadmap.description}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Your Progress</span>
              <span>{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} />
          </div>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Learning Path</h2>
          
          {roadmap.steps.map((step: any, index: number) => {
            const status = getStepStatus(step.id);
            
            return (
              <StepCard 
                key={step.id} 
                step={step} 
                index={index}
                roadmapId={roadmap.id}
                status={status}
                onStatusChange={markStepStatus}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default RoadmapDetail;
