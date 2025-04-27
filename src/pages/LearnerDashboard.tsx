
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { roadmaps } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';
import { availableBadges } from '@/utils/badgeSystem';

const LearnerDashboard = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [userRoadmaps, setUserRoadmaps] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Simulate API call to get user's roadmaps
    setTimeout(() => {
      // For demo, use the first roadmap
      const firstRoadmap = roadmaps[0];
      
      const userProgress = user.progress?.[firstRoadmap.id] || {
        completedSteps: [],
        inProgressSteps: []
      };
      
      const totalSteps = firstRoadmap.steps.length;
      const completedCount = userProgress.completedSteps.length;
      const progressPercent = Math.round((completedCount / totalSteps) * 100);
      
      const userRoadmap = {
        ...firstRoadmap,
        progress: progressPercent,
        nextStep: firstRoadmap.steps.find(step => 
          !userProgress.completedSteps.includes(step.id)
        )
      };
      
      setUserRoadmaps([userRoadmap]);
      
      // Get user badges
      const earnedBadges = availableBadges
        .filter(badge => user.badges?.includes(badge.id))
        .map(badge => ({
          ...badge,
          earned: true
        }));
        
      setUserBadges(earnedBadges);
      setLoading(false);
    }, 800);
  }, [user, navigate]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading your journey...</h2>
          <div className="mt-4">
            <Progress value={90} className="w-[300px]" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="grid gap-6">
        {/* User welcome section */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Continue your learning journey where you left off
          </p>
        </section>
        
        {/* Stats overview */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                XP Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.xp || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.badges?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Learning Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 days</div>
            </CardContent>
          </Card>
        </section>
        
        {/* Badges section */}
        {userBadges.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Your Badges</h2>
            <div className="flex flex-wrap gap-3">
              {userBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center bg-muted rounded-lg p-4 text-center w-28">
                  <div className="text-4xl mb-2">{badge.image}</div>
                  <div className="font-medium text-sm">{badge.name}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Active Roadmaps */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Your Active Roadmaps</h2>
          
          {userRoadmaps.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">You don't have any active roadmaps.</p>
                  <Button className="mt-4">Browse Roadmaps</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {userRoadmaps.map(roadmap => (
                <Card key={roadmap.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{roadmap.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {roadmap.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress</span>
                          <span>{roadmap.progress}%</span>
                        </div>
                        <Progress value={roadmap.progress} />
                      </div>
                      
                      {roadmap.nextStep && (
                        <div className="bg-muted rounded-md p-4">
                          <h4 className="font-medium">Next up: {roadmap.nextStep.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {roadmap.nextStep.description}
                          </p>
                          <Button className="mt-4" onClick={() => navigate(`/roadmap/${roadmap.id}`)}>
                            Continue Learning
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LearnerDashboard;
