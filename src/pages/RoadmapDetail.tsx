
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Play, FileText, HelpCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { roadmaps } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';

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
        // Award XP when completing a step
        const updatedUser = {
          ...user!,
          xp: (user?.xp || 0) + 50
        };
        login(updatedUser);
        
        toast({
          title: 'Step completed!',
          description: 'You earned 50 XP!',
        });
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
      
      login({
        ...user,
        progress: updatedProgress
      });
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
  
  const ResourceIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
              <Card key={step.id} className={status === 'completed' ? 'border-secondary' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {index + 1}. {step.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {step.description}
                      </CardDescription>
                    </div>
                    <div>
                      {status === 'completed' && (
                        <Badge className="bg-secondary">
                          <Check className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {status === 'inProgress' && (
                        <Badge variant="outline" className="border-primary text-primary">
                          In Progress
                        </Badge>
                      )}
                      {status === 'notStarted' && (
                        <Badge variant="outline">Not Started</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="resources">
                    <TabsList>
                      <TabsTrigger value="resources">Resources ({step.resources.length})</TabsTrigger>
                      <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="resources" className="space-y-4 pt-4">
                      {step.resources.map((resource: any) => (
                        <div key={resource.id} className="flex items-start p-3 rounded-md border">
                          <div className="mr-3 mt-1 p-1 rounded-full bg-muted">
                            <ResourceIcon type={resource.type} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {resource.description || "No description provided."}
                            </p>
                            <a 
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline inline-flex items-center mt-2"
                            >
                              View {resource.type}
                            </a>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="discussions" className="pt-4">
                      <div className="text-center py-6">
                        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
                        <h4 className="mt-2 font-medium">No discussions yet</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Be the first to start a discussion about this topic.
                        </p>
                        <Button className="mt-4">Ask a Question</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    {status !== 'inProgress' && (
                      <Button 
                        variant="outline" 
                        onClick={() => markStepStatus(step.id, 'inProgress')}
                      >
                        Mark In Progress
                      </Button>
                    )}
                    
                    {status !== 'completed' && (
                      <Button onClick={() => markStepStatus(step.id, 'completed')}>
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default RoadmapDetail;
