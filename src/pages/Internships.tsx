
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
  DialogTrigger,
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
import { Internship, addInternship, deleteInternship, getInternships, updateInternship } from '@/services/internshipService';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Internships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    status: 'pending',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    skills: ''
  });
  
  const internships = getInternships();
  
  // Filter and search internships
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = 
      internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || internship.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleAddInternship = () => {
    setEditingInternship(null);
    setFormData({
      companyName: '',
      role: '',
      status: 'pending',
      startDate: '',
      endDate: '',
      description: '',
      location: '',
      skills: ''
    });
    setOpen(true);
  };
  
  const handleEditInternship = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      companyName: internship.companyName,
      role: internship.role,
      status: internship.status,
      startDate: internship.startDate,
      endDate: internship.endDate || '',
      description: internship.description,
      location: internship.location,
      skills: internship.skills.join(', ')
    });
    setOpen(true);
  };
  
  const handleDeleteInternship = (id: string) => {
    setInternshipToDelete(id);
    setIsDeleting(true);
  };
  
  const confirmDelete = () => {
    if (internshipToDelete) {
      const success = deleteInternship(internshipToDelete);
      if (success) {
        toast.success('Internship deleted successfully');
      } else {
        toast.error('Failed to delete internship');
      }
      setIsDeleting(false);
      setInternshipToDelete(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    
    const internshipData = {
      companyName: formData.companyName,
      role: formData.role,
      status: formData.status as 'pending' | 'ongoing' | 'completed' | 'rejected',
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      description: formData.description,
      location: formData.location,
      skills: skillsArray
    };
    
    try {
      if (editingInternship) {
        updateInternship({ ...internshipData, id: editingInternship.id });
        toast.success('Internship updated successfully');
      } else {
        addInternship(internshipData);
        toast.success('Internship added successfully');
      }
      setOpen(false);
    } catch (error) {
      toast.error('Failed to save internship');
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
            <h1 className="text-3xl font-bold">Internships</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your internship applications and experiences
            </p>
          </div>
          <Button onClick={handleAddInternship}>
            <Plus size={16} className="mr-2" />
            Add Internship
          </Button>
        </div>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search internships..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Internships list */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <Card key={internship.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{internship.companyName}</CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleEditInternship(internship)}
                      >
                        <Edit size={15} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteInternship(internship.id)}
                      >
                        <Trash size={15} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground mt-1">
                    {internship.role}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      internship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      internship.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      internship.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <div className="text-sm">{internship.location}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Period:</span>
                    <div className="text-sm">
                      {new Date(internship.startDate).toLocaleDateString()} 
                      {internship.endDate && (
                        <> - {new Date(internship.endDate).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {internship.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600">No internships found</h3>
              <p className="text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try adjusting your search or filters' : 
                  'Add your first internship to get started'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleAddInternship}
                >
                  <Plus size={16} className="mr-2" />
                  Add Internship
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Internship Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingInternship ? 'Edit Internship' : 'Add New Internship'}
            </DialogTitle>
            <DialogDescription>
              {editingInternship ? 
                'Update your internship details below' : 
                'Fill in the details of your internship application or experience'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Google"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Frontend Developer Intern"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={handleInputChange}
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
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your responsibilities and achievements..."
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="React, JavaScript, UI/UX Design"
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">
                {editingInternship ? 'Update Internship' : 'Add Internship'}
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
              Are you sure you want to delete this internship? This action cannot be undone.
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

export default Internships;
