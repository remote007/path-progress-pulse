
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash, AlertOctagon } from 'lucide-react';
import { roadmaps } from '@/data/mockData';
import { useUserStore } from '@/stores/userStore';
import ResourceForm from '@/components/admin/ResourceForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminDashboard = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [allRoadmaps, setAllRoadmaps] = useState(roadmaps);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'You must be an administrator to access this page.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    // Load roadmaps from session storage or use default
    const savedRoadmaps = sessionStorage.getItem('adminRoadmaps');
    if (savedRoadmaps) {
      try {
        setAllRoadmaps(JSON.parse(savedRoadmaps));
      } catch (err) {
        console.error('Failed to parse roadmaps from session storage');
      }
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [user, navigate, toast]);
  
  // Save roadmaps to session storage whenever they change
  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem('adminRoadmaps', JSON.stringify(allRoadmaps));
    }
  }, [allRoadmaps, loading]);
  
  const handleRoadmapChange = (value: string) => {
    setSelectedRoadmap(value);
    setSelectedStep(null); // Reset step when roadmap changes
  };
  
  const handleStepChange = (value: string) => {
    setSelectedStep(value);
  };
  
  const handleAddResource = () => {
    setEditingResource(null);
    setDialogOpen(true);
  };
  
  const handleEditResource = (roadmapId: string, stepId: string, resource: any) => {
    setSelectedRoadmap(roadmapId);
    setSelectedStep(stepId);
    setEditingResource(resource);
    setDialogOpen(true);
  };
  
  const handleDeletePrompt = (roadmapId: string, stepId: string, resource: any) => {
    setSelectedRoadmap(roadmapId);
    setSelectedStep(stepId);
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteResource = () => {
    if (!selectedRoadmap || !selectedStep || !resourceToDelete) {
      return;
    }
    
    // Update roadmaps by filtering out the resource
    const updatedRoadmaps = allRoadmaps.map(roadmap => {
      if (roadmap.id === selectedRoadmap) {
        return {
          ...roadmap,
          steps: roadmap.steps.map(step => {
            if (step.id === selectedStep) {
              return {
                ...step,
                resources: step.resources.filter((resource: any) => resource.id !== resourceToDelete.id)
              };
            }
            return step;
          })
        };
      }
      return roadmap;
    });
    
    setAllRoadmaps(updatedRoadmaps);
    setDeleteDialogOpen(false);
    setResourceToDelete(null);
    
    toast({
      title: 'Resource deleted',
      description: 'The resource has been removed successfully.',
    });
  };
  
  const handleResourceSubmit = (resourceData: any) => {
    if (!selectedRoadmap || !selectedStep) {
      toast({
        title: 'Selection required',
        description: 'Please select a roadmap and step.',
        variant: 'destructive',
      });
      return;
    }
    
    // Update roadmaps with the new or edited resource
    const updatedRoadmaps = allRoadmaps.map(roadmap => {
      if (roadmap.id === selectedRoadmap) {
        return {
          ...roadmap,
          steps: roadmap.steps.map(step => {
            if (step.id === selectedStep) {
              if (editingResource) {
                // Edit existing resource
                return {
                  ...step,
                  resources: step.resources.map((resource: any) => 
                    resource.id === resourceData.id ? resourceData : resource
                  )
                };
              } else {
                // Add new resource
                return {
                  ...step,
                  resources: [...step.resources, resourceData]
                };
              }
            }
            return step;
          })
        };
      }
      return roadmap;
    });
    
    setAllRoadmaps(updatedRoadmaps);
    setDialogOpen(false);
    
    toast({
      title: editingResource ? 'Resource updated!' : 'Resource added!',
      description: editingResource 
        ? 'The resource has been updated successfully.' 
        : 'The resource has been added successfully.',
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
          <Button onClick={handleAddResource}>
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
                      <ul className="space-y-4">
                        {roadmap.steps.map(step => (
                          <li key={step.id} className="bg-muted rounded-md p-4">
                            <div>
                              <h4 className="font-medium">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                              
                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Resources: {step.resources.length}</h5>
                                
                                {step.resources.length > 0 ? (
                                  <ul className="space-y-2">
                                    {step.resources.map((resource: any) => (
                                      <li key={resource.id} className="border rounded-md p-3 bg-background">
                                        <div className="flex justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center">
                                              <span className="font-medium">{resource.title}</span>
                                              <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">{resource.type}</span>
                                            </div>
                                            {resource.description && (
                                              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                                            )}
                                            <a 
                                              href={resource.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-xs text-primary hover:underline mt-1 inline-block"
                                            >
                                              {resource.url}
                                            </a>
                                          </div>
                                          <div className="flex space-x-2">
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleEditResource(roadmap.id, step.id, resource)}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              variant="destructive"
                                              onClick={() => handleDeletePrompt(roadmap.id, step.id, resource)}
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <div className="text-center py-4 border rounded-md">
                                    <p className="text-sm text-muted-foreground">No resources added yet</p>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="mt-2"
                                      onClick={() => {
                                        setSelectedRoadmap(roadmap.id);
                                        setSelectedStep(step.id);
                                        handleAddResource();
                                      }}
                                    >
                                      Add First Resource
                                    </Button>
                                  </div>
                                )}
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
      
      {/* Add/Edit Resource Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
            <DialogDescription>
              {editingResource 
                ? 'Update the details of this learning resource.' 
                : 'Add a learning resource to a specific roadmap step.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!editingResource && (
              <>
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
              </>
            )}
            
            <ResourceForm 
              roadmapId={selectedRoadmap} 
              stepId={selectedStep} 
              initialData={editingResource}
              onSubmit={handleResourceSubmit}
              onCancel={() => setDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-destructive" />
              Delete Resource
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
