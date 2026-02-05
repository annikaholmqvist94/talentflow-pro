import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { api } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Building2, UserPlus, ArrowLeftRight, Shield, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Organization {
  id: string;
  name: string;
}

export default function AdminPanel() {
  const { currentUser, addUser } = useAuth();
  const { setOrganizationId } = useOrganization();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect non-admins
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Organization state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrgName, setNewOrgName] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);

  // User creation state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN'>('USER');
  const [userOrgId, setUserOrgId] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // Org switch state
  const [selectedOrgId, setSelectedOrgId] = useState('');

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const data = await api.get<Organization[]>('/organizations');
      setOrganizations(data || []);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setCreatingOrg(true);
    try {
      const newOrg = await api.post<Organization>('/organizations', {
        name: newOrgName.trim()
      });
      
      if (newOrg) {
        setOrganizations(prev => [...prev, newOrg]);
        setNewOrgName('');
        toast({
          title: 'Organization Created',
          description: `"${newOrg.name}" has been created successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create organization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingOrg(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !userPassword || !userFullName || !userOrgId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (userPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setCreatingUser(true);
    try {
      const selectedOrg = organizations.find(o => o.id === userOrgId);
      const newUserId = uuidv4();

      // Create user in backend
      await api.post('/users', {
        id: newUserId,
        email: userEmail,
        fullName: userFullName,
        organizationId: userOrgId,
        role: userRole,
      });

      // Add to local auth users so they can login
      addUser({
        id: newUserId,
        email: userEmail,
        password: userPassword,
        fullName: userFullName,
        role: userRole,
        organizationId: userOrgId,
        organizationName: selectedOrg?.name || 'Unknown',
      });

      toast({
        title: 'User Created',
        description: `Account for "${userFullName}" has been created. They can now log in.`,
      });

      // Reset form
      setUserEmail('');
      setUserPassword('');
      setUserFullName('');
      setUserRole('USER');
      setUserOrgId('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleSwitchOrganization = () => {
    if (!selectedOrgId) return;

    const selectedOrg = organizations.find(o => o.id === selectedOrgId);
    setOrganizationId(selectedOrgId);
    localStorage.setItem('adminSelectedOrgId', selectedOrgId);
    
    toast({
      title: 'Organization Switched',
      description: `Now viewing data for "${selectedOrg?.name}".`,
    });
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage organizations and user accounts
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Organization */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Create Organization</CardTitle>
              </div>
              <CardDescription>
                Add a new organization to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    placeholder="e.g., Tech Startup Inc."
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={creatingOrg} className="w-full">
                  {creatingOrg ? 'Creating...' : 'Create Organization'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Organization Switcher */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Switch Organization</CardTitle>
              </div>
              <CardDescription>
                View and manage any organization's data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Organization</Label>
                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleSwitchOrganization} 
                  disabled={!selectedOrgId}
                  className="w-full"
                >
                  Switch Organization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create User - Full Width */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Create User Account</CardTitle>
            </div>
            <CardDescription>
              Add a new user who can log in and access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@company.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPassword">Password *</Label>
                  <Input
                    id="userPassword"
                    type="password"
                    placeholder="Min 6 characters"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userFullName">Full Name *</Label>
                  <Input
                    id="userFullName"
                    placeholder="John Doe"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userRole">Role *</Label>
                  <Select value={userRole} onValueChange={(v: 'USER' | 'ADMIN') => setUserRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userOrg">Organization *</Label>
                <Select value={userOrgId} onValueChange={setUserOrgId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={creatingUser} className="w-full">
                {creatingUser ? 'Creating User...' : 'Create User Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Created users can log in immediately with their credentials</li>
                  <li>Admins can switch between organizations to view all data</li>
                  <li>Regular users can only see their own organization's data</li>
                  <li>All data is scoped to the currently selected organization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
