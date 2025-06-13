
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Plus, ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Outing {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  participants: string[];
  status: 'ongoing' | 'completed';
  totalAmount: number;
  instanceCount: number;
}

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

const Society = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [society, setSociety] = useState<Society | null>(null);
  const [outings, setOutings] = useState<Outing[]>([]);
  const [isCreateOutingOpen, setIsCreateOutingOpen] = useState(false);
  const [newOutingName, setNewOutingName] = useState('');

  useEffect(() => {
    // Mock society data
    const mockSociety: Society = {
      id: id || '1',
      name: 'College Friends',
      code: 'COLL123',
      createdBy: user?.id || '1',
      createdAt: '2024-01-15',
      joinedAt: '2024-01-15',
      memberCount: 8,
      outingCount: 12,
      isCreator: true
    };

    const mockOutings: Outing[] = [
      {
        id: '1',
        name: 'Weekend Trip to Mountains',
        createdBy: user?.id || '1',
        createdAt: '2024-06-10',
        participants: ['1', '2', '3', '4'],
        status: 'ongoing',
        totalAmount: 450.00,
        instanceCount: 3
      },
      {
        id: '2',
        name: 'Birthday Celebration',
        createdBy: '2',
        createdAt: '2024-06-05',
        participants: ['1', '2', '3', '4', '5'],
        status: 'completed',
        totalAmount: 280.50,
        instanceCount: 5
      }
    ];

    setSociety(mockSociety);
    setOutings(mockOutings);
  }, [id, user]);

  const handleCreateOuting = () => {
    if (!newOutingName) {
      toast({
        title: "Error",
        description: "Please enter an outing name",
        variant: "destructive"
      });
      return;
    }

    const newOuting: Outing = {
      id: Date.now().toString(),
      name: newOutingName,
      createdBy: user?.id || '1',
      createdAt: new Date().toISOString(),
      participants: [user?.id || '1'],
      status: 'ongoing',
      totalAmount: 0,
      instanceCount: 0
    };

    setOutings(prev => [newOuting, ...prev]);
    setNewOutingName('');
    setIsCreateOutingOpen(false);

    toast({
      title: "Success",
      description: `Outing "${newOuting.name}" created successfully!`
    });
  };

  const getDaysAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  };

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    const outingDates = outings.map(o => new Date(o.createdAt).getDate());
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasOuting = outingDates.includes(day);
      const isToday = day === today.getDate();
      
      days.push(
        <div
          key={day}
          className={`p-2 text-center text-sm border rounded ${
            hasOuting 
              ? 'bg-primary/20 border-primary text-primary font-semibold' 
              : 'border-border/30'
          } ${
            isToday ? 'ring-2 ring-primary/50' : ''
          }`}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  if (!society) {
    return <div>Loading...</div>;
  }

  const ongoingOutings = outings.filter(o => o.status === 'ongoing');
  const completedOutings = outings.filter(o => o.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/societies">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{society.name}</h1>
          <p className="text-muted-foreground">
            {society.isCreator ? 'Created' : 'Joined'} {getDaysAgo(society.joinedAt)}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{society.memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{outings.length}</p>
                <p className="text-sm text-muted-foreground">Total Outings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  ${outings.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Activity Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar()}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary/20 border border-primary mr-2"></div>
                  Outings scheduled
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outings */}
        <div className="lg:col-span-2">
          {/* Ongoing Outings */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Ongoing Outings</h2>
              <Dialog open={isCreateOutingOpen} onOpenChange={setIsCreateOutingOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Outing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Outing</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="outing-name">Outing Name</Label>
                      <Input
                        id="outing-name"
                        placeholder="Enter outing name"
                        value={newOutingName}
                        onChange={(e) => setNewOutingName(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleCreateOuting} className="w-full">
                      Create Outing
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {ongoingOutings.length > 0 ? (
              <div className="space-y-4">
                {ongoingOutings.map((outing) => (
                  <Link key={outing.id} to={`/outing/${outing.id}`}>
                    <Card className="hover-lift cursor-pointer bg-card/50 border-primary/20 hover:border-primary/40">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{outing.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              Created {getDaysAgo(outing.createdAt)}
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary">Ongoing</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                              {outing.participants.length} joined
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                              {outing.instanceCount} instances
                            </div>
                          </div>
                          <div className="text-lg font-semibold">
                            ${outing.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 border-dashed">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No ongoing outings</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completed Outings */}
          {completedOutings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Outings</h2>
              <div className="space-y-4">
                {completedOutings.map((outing) => (
                  <Link key={outing.id} to={`/outing/${outing.id}`}>
                    <Card className="hover-lift cursor-pointer bg-card/50 border-secondary/20 hover:border-secondary/40">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{outing.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              {getDaysAgo(outing.createdAt)}
                            </div>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                              {outing.participants.length} participated
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                              {outing.instanceCount} instances
                            </div>
                          </div>
                          <div className="text-lg font-semibold">
                            ${outing.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Society;
