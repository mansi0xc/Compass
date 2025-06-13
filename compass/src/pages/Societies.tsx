
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Calendar, Code, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Society {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
  joinedAt: string;
  memberCount: number;
  outingCount: number;
  isCreator: boolean;
}

const Societies = () => {
  const { user } = useAuth();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [newSociety, setNewSociety] = useState({ name: '', code: '' });
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    // Load mock societies
    const mockSocieties: Society[] = [
      {
        id: '1',
        name: 'College Friends',
        code: 'COLL123',
        createdBy: user?.id || '1',
        createdAt: '2024-01-15',
        joinedAt: '2024-01-15',
        memberCount: 8,
        outingCount: 12,
        isCreator: true
      },
      {
        id: '2',
        name: 'Office Team',
        code: 'WORK456',
        createdBy: '2',
        createdAt: '2024-02-20',
        joinedAt: '2024-02-22',
        memberCount: 5,
        outingCount: 6,
        isCreator: false
      }
    ];
    setSocieties(mockSocieties);
  }, [user]);

  const handleCreateSociety = () => {
    if (!newSociety.name || !newSociety.code) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const society: Society = {
      id: Date.now().toString(),
      name: newSociety.name,
      code: newSociety.code.toUpperCase(),
      createdBy: user?.id || '1',
      createdAt: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      memberCount: 1,
      outingCount: 0,
      isCreator: true
    };

    setSocieties(prev => [society, ...prev]);
    setNewSociety({ name: '', code: '' });
    setIsCreateOpen(false);
    
    toast({
      title: "Success",
      description: `Society "${society.name}" created successfully!`
    });
  };

  const handleJoinSociety = () => {
    if (!joinCode) {
      toast({
        title: "Error",
        description: "Please enter a society code",
        variant: "destructive"
      });
      return;
    }

    // Mock joining a society
    const mockSociety: Society = {
      id: Date.now().toString(),
      name: 'New Society',
      code: joinCode.toUpperCase(),
      createdBy: '999',
      createdAt: '2024-01-01',
      joinedAt: new Date().toISOString(),
      memberCount: 3,
      outingCount: 2,
      isCreator: false
    };

    setSocieties(prev => [...prev, mockSociety]);
    setJoinCode('');
    setIsJoinOpen(false);
    
    toast({
      title: "Success",
      description: `Joined society successfully!`
    });
  };

  const getDaysAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  };

  const createdSocieties = societies.filter(s => s.isCreator);
  const joinedSocieties = societies.filter(s => !s.isCreator);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Societies</h1>
          <p className="text-muted-foreground">
            Manage your communities and group activities
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/30 hover:border-primary">
                <UserPlus className="mr-2 h-4 w-4" />
                Join Society
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Society</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="join-code">Society Code</Label>
                  <Input
                    id="join-code"
                    placeholder="Enter society code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                </div>
                <Button onClick={handleJoinSociety} className="w-full">
                  Join Society
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Society
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Society</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="society-name">Society Name</Label>
                  <Input
                    id="society-name"
                    placeholder="Enter society name"
                    value={newSociety.name}
                    onChange={(e) => setNewSociety(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="society-code">Invite Code</Label>
                  <Input
                    id="society-code"
                    placeholder="Create invite code"
                    value={newSociety.code}
                    onChange={(e) => setNewSociety(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  />
                </div>
                <Button onClick={handleCreateSociety} className="w-full">
                  Create Society
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Created Societies */}
      {createdSocieties.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Created Societies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdSocieties.map((society) => (
              <Link key={society.id} to={`/society/${society.id}`}>
                <Card className="hover-lift cursor-pointer bg-card/50 border-primary/20 hover:border-primary/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{society.name}</CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Creator
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created {getDaysAgo(society.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          {society.memberCount}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {society.outingCount}
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Code className="mr-1 h-3 w-3" />
                        {society.code}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Joined Societies */}
      {joinedSocieties.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-secondary" />
            Joined Societies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedSocieties.map((society) => (
              <Link key={society.id} to={`/society/${society.id}`}>
                <Card className="hover-lift cursor-pointer bg-card/50 border-secondary/20 hover:border-secondary/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{society.name}</CardTitle>
                      <Badge variant="outline">Member</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Joined {getDaysAgo(society.joinedAt)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                          {society.memberCount}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                          {society.outingCount}
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Code className="mr-1 h-3 w-3" />
                        {society.code}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {societies.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No societies yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first society or join one with an invite code
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Society
            </Button>
            <Button variant="outline" onClick={() => setIsJoinOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Join Society
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Societies;
