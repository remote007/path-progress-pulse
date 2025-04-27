
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';
import { roadmaps } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';

const AdminDashboard = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [allRoadmaps, setAllRoadmaps] = useState(roadmaps);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    url: ''
  });
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [user, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value
    }));
  };
  
  const handleRoadmapChange = (value: string) => {
    setSelectedRoadmap(value);
    setSelectedStep(null); // Reset step when roadmap changes
  };
  
  const handleStepChange = (value: string) => {
    setSelectedStep(value);
  };
  
  const handleAddResource = () => {
    if (!selectedRoadmap || !selectedStep) {
      toast({
        title: 'Selection required',
        description: 'Please select a roadmap and step.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate form
    if (!formData.title || !formData.url) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create new resource
    const newResource = {
      id: `resource-${Date.now()}`,
      ...formData
    };
    
    // Update roadmaps (would save to API in a real app)
    const updatedRoadmaps = allRoadmaps.map(roadmap => {
      if (roadmap.id === selectedRoadmap) {
        return {
          ...roadmap,
          steps: roadmap.steps.map(step => {
            if (step.id === selectedStep) {
              return {
                ...step,
                resources: [...step.resources, newResource]
              };
            }
            return step;
          })
        };
      }
      return roadmap;
    });
    
    setAllRoadmaps(updatedRoadmaps);
    setDialogOpen(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'video',
      url: ''
    });
    
    toast({
      title: 'Resource added!',
      description: 'The resource has been added successfully.',
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading admin panel...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="grid gap-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage learning roadmaps and resources
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </section>
        
        {/* Roadmap List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Roadmaps</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {allRoadmaps.map(roadmap => (
              <Card key={roadmap.id}>
                <CardHeader>
                  <CardTitle>{roadmap.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>{roadmap.description}</p>
                    
                    <div>
                      <h3 className="font-medium mb-2">Steps:</h3>
                      <ul className="space-y-2">
                        {roadmap.steps.map(step => (
                          <li key={step.id} className="bg-muted rounded-md p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{step.title}</h4>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                <div className="mt-2">
                                  <h5 className="text-sm font-medium">Resources: {step.resources.length}</h5>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      
      {/* Add Resource Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Add a learning resource to a specific roadmap step.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roadmap">Select Roadmap</Label>
              <Select value={selectedRoadmap || ''} onValueChange={handleRoadmapChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a roadmap" />
                </SelectTrigger>
                <SelectContent>
                  {allRoadmaps.map(roadmap => (
                    <SelectItem key={roadmap.id} value={roadmap.id}>
                      {roadmap.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="step">Select Step</Label>
              <Select 
                value={selectedStep || ''} 
                onValueChange={handleStepChange}
                disabled={!selectedRoadmap}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a step" />
                </SelectTrigger>
                <SelectContent>
                  {selectedRoadmap && allRoadmaps
                    .find(r => r.id === selectedRoadmap)?.steps
                    .map(step => (
                      <SelectItem key={step.id} value={step.id}>
                        {step.title}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter resource title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter resource description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="blog">Blog / Article</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="Enter resource URL"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddResource}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
