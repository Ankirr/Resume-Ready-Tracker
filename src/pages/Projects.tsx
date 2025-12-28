
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Project, addProject, deleteProject, getProjects, updateProject } from '@/services/projectService';
import { Plus, Edit, Trash, Search, Github, ExternalLink, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
    startDate: '',
    endDate: '',
    status: 'in-progress',
    imageUrl: ''
  });
  
  const projects = getProjects();
  
  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      demoUrl: '',
      startDate: '',
      endDate: '',
      status: 'in-progress',
      imageUrl: ''
    });
    setOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      startDate: project.startDate,
      endDate: project.endDate || '',
      status: project.status,
      imageUrl: project.imageUrl || ''
    });
    setOpen(true);
  };
  
  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
    setIsDeleting(true);
  };
  
  const confirmDelete = () => {
    if (projectToDelete) {
      const success = deleteProject(projectToDelete);
      if (success) {
        toast.success('Project deleted successfully');
      } else {
        toast.error('Failed to delete project');
      }
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const technologiesArray = formData.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech !== '');
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      technologies: technologiesArray,
      githubUrl: formData.githubUrl || undefined,
      demoUrl: formData.demoUrl || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      status: formData.status as 'in-progress' | 'completed' | 'on-hold',
      imageUrl: formData.imageUrl || undefined
    };
    
    try {
      if (editingProject) {
        updateProject({ ...projectData, id: editingProject.id });
        toast.success('Project updated successfully');
      } else {
        addProject(projectData);
        toast.success('Project added successfully');
      }
      setOpen(false);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal and academic projects
            </p>
          </div>
          <Button onClick={handleAddProject}>
            <Plus size={16} className="mr-2" />
            Add Project
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Projects list */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit size={15} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash size={15} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'in-progress' ? 'In Progress' : 
                       project.status === 'on-hold' ? 'On Hold' : 'Completed'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} 
                      {project.endDate && (
                        <> - {new Date(project.endDate).toLocaleDateString()}</>
                      )}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm line-clamp-3">{project.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1 my-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-gray-700 hover:text-primary"
                        >
                          <Github size={14} className="mr-1" />
                          GitHub
                        </a>
                      )}
                      
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-gray-700 hover:text-primary"
                        >
                          <ExternalLink size={14} className="mr-1" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600">No projects found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try adjusting your search or filters' : 
                  'Add your first project to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddProject}
                >
                  <Plus size={16} className="mr-2" />
                  Add Project
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Project Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 
                'Update your project details below' : 
                'Fill in the details of your project'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E-commerce Website"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your project, its purpose and features..."
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  placeholder="https://github.com/username/project"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
                <Input
                  id="demoUrl"
                  name="demoUrl"
                  placeholder="https://project-demo.example.com"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Projects;
