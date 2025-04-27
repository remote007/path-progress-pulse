
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Play, FileText, HelpCircle, MessageSquare, Send } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Resource {
  id: string;
  title: string;
  type: string;
  description?: string;
  url: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
}

interface StepCardProps {
  step: Step;
  index: number;
  roadmapId: string;
  status: 'completed' | 'inProgress' | 'notStarted';
  onStatusChange: (stepId: string, status: 'inProgress' | 'completed') => void;
}

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

const StepCard = ({ step, index, roadmapId, status, onStatusChange }: StepCardProps) => {
  const { toast } = useToast();
  const { user, login } = useUserStore();
  const [question, setQuestion] = useState('');
  const [discussions, setDiscussions] = useState<{ id: string; question: string; username: string; date: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuestion = () => {
    if (!question.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      const newDiscussion = {
        id: `discussion-${Date.now()}`,
        question: question.trim(),
        username: user?.name || 'Anonymous',
        date: new Date().toLocaleDateString()
      };
      
      setDiscussions(prev => [newDiscussion, ...prev]);
      setQuestion('');
      setIsSubmitting(false);
      
      toast({
        title: 'Question posted!',
        description: 'Your question has been submitted successfully.',
      });
    }, 500);
  };

  return (
    <Card className={status === 'completed' ? 'border-secondary' : ''}>
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
            <TabsTrigger value="discussions">Discussions ({discussions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-4 pt-4">
            {step.resources.map((resource: Resource) => (
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
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Ask a question about this topic..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSubmitQuestion} 
                  disabled={isSubmitting || !question.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {discussions.length > 0 ? (
                <div className="space-y-3">
                  {discussions.map(discussion => (
                    <div key={discussion.id} className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{discussion.username}</span>
                        <span className="text-sm text-muted-foreground">{discussion.date}</span>
                      </div>
                      <p className="mt-1">{discussion.question}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground" />
                  <h4 className="mt-2 font-medium">No discussions yet</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be the first to start a discussion about this topic.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3 mt-6">
          {status !== 'inProgress' && (
            <Button 
              variant="outline" 
              onClick={() => onStatusChange(step.id, 'inProgress')}
            >
              Mark In Progress
            </Button>
          )}
          
          {status !== 'completed' && (
            <Button onClick={() => onStatusChange(step.id, 'completed')}>
              Mark as Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
