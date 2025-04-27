
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface ResourceFormProps {
  roadmapId: string | null;
  stepId: string | null;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ResourceForm = ({ roadmapId, stepId, initialData, onSubmit, onCancel }: ResourceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'video',
    url: initialData?.url || ''
  });
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roadmapId || !stepId) {
      toast({
        title: 'Missing information',
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
    const resourceData = {
      id: initialData?.id || `resource-${Date.now()}`,
      ...formData
    };
    
    onSubmit(resourceData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Resource Title*</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter resource title"
          required
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
        <Label htmlFor="type">Resource Type*</Label>
        <Select value={formData.type} onValueChange={handleTypeChange} required>
          <SelectTrigger id="type">
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
        <Label htmlFor="url">URL*</Label>
        <Input
          id="url"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          placeholder="Enter resource URL"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Resource' : 'Add Resource'}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
