
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { getInternships } from '@/services/internshipService';
import { getProjects } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { Download, FileText } from 'lucide-react';

const Resume = () => {
  const { user } = useAuth();
  const internships = getInternships();
  const projects = getProjects();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary: ''
  });
  
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState([
    { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }
  ]);
  
  const [selectedInternships, setSelectedInternships] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };
  
  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
  };
  
  const removeEducation = (index: number) => {
    if (education.length > 1) {
      const newEducation = [...education];
      newEducation.splice(index, 1);
      setEducation(newEducation);
    }
  };
  
  const toggleInternship = (id: string) => {
    setSelectedInternships(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const toggleProject = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
  
  const generateResume = () => {
    if (!personalInfo.name || !personalInfo.email) {
      toast.error('Please provide at least your name and email');
      return;
    }
    
    // In a real application, this would connect to a backend service
    // to generate a PDF resume and trigger download
    toast.success('Resume generated and downloaded successfully!');
    
    // For this demo, we'll display what would be included in the resume
    console.log('Resume Content:', {
      personalInfo,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      education,
      internships: internships.filter(i => selectedInternships.includes(i.id)),
      projects: projects.filter(p => selectedProjects.includes(p.id))
    });
    
    // Simulate download delay
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Resume content would be here in a real implementation'));
      element.setAttribute('download', `${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create a professional resume based on your internships and projects
          </p>
        </div>
        
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="preview">Preview & Download</TabsTrigger>
          </TabsList>
          
          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Add your contact information and professional summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={personalInfo.location}
                      onChange={handlePersonalInfoChange}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn URL</Label>
                    <Input
                      id="linkedIn"
                      name="linkedIn"
                      value={personalInfo.linkedIn}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={personalInfo.website}
                      onChange={handlePersonalInfoChange}
                      placeholder="https://johndoe.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={personalInfo.summary}
                    onChange={handlePersonalInfoChange}
                    placeholder="Briefly describe your professional background, goals, and expertise..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="JavaScript, React, Node.js, UI/UX Design, Project Management..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Tab */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add information about your educational background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="space-y-4 border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                      {education.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeEducation(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`school-${index}`}>School/University</Label>
                        <Input
                          id={`school-${index}`}
                          value={edu.school}
                          onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                          placeholder="Stanford University"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                        <Input
                          id={`degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}`}>Field of Study</Label>
                        <Input
                          id={`field-${index}`}
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                          placeholder="Computer Science"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                        <Input
                          id={`gpa-${index}`}
                          value={edu.gpa}
                          onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                          placeholder="3.8/4.0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date (or Expected)</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={addEducation}
                  className="w-full"
                >
                  Add Another Education
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>
                  Select the internships and projects to include in your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Internships</h3>
                  {internships.length > 0 ? (
                    <ul className="space-y-2">
                      {internships.map((internship) => (
                        <li key={internship.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`internship-${internship.id}`}
                            checked={selectedInternships.includes(internship.id)}
                            onChange={() => toggleInternship(internship.id)}
                            className="mr-2 h-4 w-4 rounded"
                          />
                          <label htmlFor={`internship-${internship.id}`} className="flex flex-col">
                            <span className="font-medium">{internship.companyName} - {internship.role}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(internship.startDate).toLocaleDateString()} 
                              {internship.endDate && (
                                <> - {new Date(internship.endDate).toLocaleDateString()}</>
                              )}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No internships available. Add internships in the Internships section.
                    </p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Projects</h3>
                  {projects.length > 0 ? (
                    <ul className="space-y-2">
                      {projects.map((project) => (
                        <li key={project.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`project-${project.id}`}
                            checked={selectedProjects.includes(project.id)}
                            onChange={() => toggleProject(project.id)}
                            className="mr-2 h-4 w-4 rounded"
                          />
                          <label htmlFor={`project-${project.id}`} className="flex flex-col">
                            <span className="font-medium">{project.title}</span>
                            <span className="text-sm text-gray-500">
                              {project.technologies.join(', ')}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No projects available. Add projects in the Projects section.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
                <CardDescription>
                  Preview your resume and download it as a PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold">{personalInfo.name || "Your Name"}</h2>
                    <div className="text-sm text-gray-600 space-x-2">
                      {personalInfo.email && <span>{personalInfo.email}</span>}
                      {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                      {personalInfo.location && <span>• {personalInfo.location}</span>}
                    </div>
                    <div className="text-sm text-gray-600 space-x-2">
                      {personalInfo.linkedIn && <span>LinkedIn: {personalInfo.linkedIn}</span>}
                      {personalInfo.website && <span>• Website: {personalInfo.website}</span>}
                    </div>
                  </div>
                  
                  {personalInfo.summary && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold border-b pb-1 mb-2">Summary</h3>
                      <p className="text-sm">{personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {skills && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold border-b pb-1 mb-2">Skills</h3>
                      <p className="text-sm">{skills}</p>
                    </div>
                  )}
                  
                  {education.some(edu => edu.school) && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold border-b pb-1 mb-2">Education</h3>
                      {education.map((edu, index) => edu.school && (
                        <div key={index} className="mb-2">
                          <div className="flex justify-between">
                            <div className="font-medium">{edu.school}</div>
                            <div className="text-sm">
                              {edu.startDate && new Date(edu.startDate).getFullYear()}
                              {edu.endDate && ` - ${new Date(edu.endDate).getFullYear()}`}
                            </div>
                          </div>
                          <div>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                          {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedInternships.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold border-b pb-1 mb-2">Professional Experience</h3>
                      {internships
                        .filter(i => selectedInternships.includes(i.id))
                        .map((internship) => (
                          <div key={internship.id} className="mb-3">
                            <div className="flex justify-between">
                              <div className="font-medium">{internship.companyName}</div>
                              <div className="text-sm">
                                {new Date(internship.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} 
                                {internship.endDate && (
                                  <> - {new Date(internship.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</>
                                )}
                              </div>
                            </div>
                            <div className="font-medium">{internship.role}</div>
                            <div className="text-sm mt-1">{internship.location}</div>
                            <p className="text-sm mt-1">{internship.description}</p>
                            {internship.skills.length > 0 && (
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Technologies:</span> {internship.skills.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                  
                  {selectedProjects.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-bold border-b pb-1 mb-2">Projects</h3>
                      {projects
                        .filter(p => selectedProjects.includes(p.id))
                        .map((project) => (
                          <div key={project.id} className="mb-3">
                            <div className="flex justify-between">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm">
                                {new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} 
                                {project.endDate && (
                                  <> - {new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</>
                                )}
                              </div>
                            </div>
                            <p className="text-sm mt-1">{project.description}</p>
                            {project.technologies.length > 0 && (
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                              </div>
                            )}
                            {(project.githubUrl || project.demoUrl) && (
                              <div className="mt-1 text-sm">
                                {project.githubUrl && <span>GitHub: {project.githubUrl}</span>}
                                {project.githubUrl && project.demoUrl && <span> • </span>}
                                {project.demoUrl && <span>Demo: {project.demoUrl}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                
                <Button onClick={generateResume} className="w-full">
                  <Download size={16} className="mr-2" />
                  Generate & Download Resume
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Resume;
