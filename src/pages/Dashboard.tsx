
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, List, FileText, ArrowRight } from 'lucide-react';
import { getInternships } from '@/services/internshipService';
import { getProjects } from '@/services/projectService';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const internships = getInternships();
  const projects = getProjects();
  
  const pendingInternships = internships.filter(i => i.status === 'pending').length;
  const ongoingInternships = internships.filter(i => i.status === 'ongoing').length;
  const completedInternships = internships.filter(i => i.status === 'completed').length;
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  const stats = [
    { 
      title: 'Total Internships', 
      value: internships.length,
      description: `${pendingInternships} pending, ${ongoingInternships} ongoing, ${completedInternships} completed`,
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
      link: '/internships'
    },
    { 
      title: 'Total Projects', 
      value: totalProjects,
      description: `${completedProjects} completed, ${totalProjects - completedProjects} in progress`,
      icon: List,
      color: 'bg-green-100 text-green-600',
      link: '/projects'
    },
    { 
      title: 'Resume Ready', 
      value: completedInternships + completedProjects,
      description: `${completedInternships + completedProjects} items to add to your resume`,
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      link: '/resume'
    }
  ];
  
  // Show most recent internships and projects for quick access
  const recentInternships = [...internships].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  ).slice(0, 2);
  
  const recentProjects = [...projects].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  ).slice(0, 2);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your career development
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Link to={stat.link} key={i}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Recent activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Internships</CardTitle>
              <CardDescription>
                Your most recent internship activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentInternships.length > 0 ? (
                <ul className="space-y-4">
                  {recentInternships.map((internship) => (
                    <li key={internship.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium">{internship.companyName}</div>
                        <div className="text-sm text-gray-500">{internship.role}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        internship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        internship.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        internship.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No internships found. Add your first one!
                </div>
              )}
              <Link 
                to="/internships" 
                className="inline-flex items-center text-sm text-primary mt-4 hover:underline"
              >
                View all internships
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your most recent project activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentProjects.length > 0 ? (
                <ul className="space-y-4">
                  {recentProjects.map((project) => (
                    <li key={project.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[250px]">
                          {project.description.substring(0, 50)}...
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'in-progress' ? 'In Progress' : 
                         project.status === 'on-hold' ? 'On Hold' : 'Completed'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No projects found. Add your first one!
                </div>
              )}
              <Link 
                to="/projects" 
                className="inline-flex items-center text-sm text-primary mt-4 hover:underline"
              >
                View all projects
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
