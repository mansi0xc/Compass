
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Plus, ArrowLeft, MapPin, Clock, DollarSign, Receipt, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Instance {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  participants: string[];
  participantNames: string[];
  createdAt: string;
  description?: string;
}

interface Outing {
  id: string;
  name: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  participants: string[];
  status: 'ongoing' | 'completed';
  totalAmount: number;
  instanceCount: number;
  societyId: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  totalPaid: number;
  totalOwed: number;
  balance: number;
}

const Outing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [outing, setOuting] = useState<Outing | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [currentUserSummary, setCurrentUserSummary] = useState<Participant | null>(null);
  const [isCreateInstanceOpen, setIsCreateInstanceOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [newInstanceAmount, setNewInstanceAmount] = useState('');
  const [newInstanceDescription, setNewInstanceDescription] = useState('');

  useEffect(() => {
    // Mock outing data
    const mockOuting: Outing = {
      id: id || '1',
      name: 'Weekend Trip to Mountains',
      createdBy: user?.id || '1',
      createdByName: user?.name || 'John Doe',
      createdAt: '2024-06-10',
      participants: ['1', '2', '3', '4'],
      status: 'ongoing',
      totalAmount: 450.00,
      instanceCount: 3,
      societyId: '1'
    };

    const mockInstances: Instance[] = [
      {
        id: '1',
        name: 'Hotel Booking',
        amount: 240.00,
        paidBy: '1',
        paidByName: 'John Doe',
        participants: ['1', '2', '3', '4'],
        participantNames: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
        createdAt: '2024-06-10T10:00:00Z',
        description: 'Mountain View Resort - 2 nights'
      },
      {
        id: '2',
        name: 'Gas & Transportation',
        amount: 120.00,
        paidBy: '2',
        paidByName: 'Jane Smith',
        participants: ['1', '2', '3', '4'],
        participantNames: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
        createdAt: '2024-06-10T14:30:00Z',
        description: 'Fuel for the trip'
      },
      {
        id: '3',
        name: 'Groceries & Snacks',
        amount: 90.00,
        paidBy: '3',
        paidByName: 'Mike Johnson',
        participants: ['1', '2', '3'],
        participantNames: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        createdAt: '2024-06-11T09:15:00Z',
        description: 'Food and drinks for the weekend'
      }
    ];

    // Current user's bill summary
    const mockCurrentUserSummary: Participant = {
      id: user?.id || '1',
      name: user?.name || 'John Doe',
      avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      totalPaid: 240.00,
      totalOwed: 112.50,
      balance: 127.50
    };

    setOuting(mockOuting);
    setInstances(mockInstances);
    setCurrentUserSummary(mockCurrentUserSummary);
  }, [id, user]);

  const handleCreateInstance = () => {
    if (!newInstanceName || !newInstanceAmount) {
      toast({
        title: "Error",
        description: "Please enter instance name and amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newInstanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const newInstance: Instance = {
      id: Date.now().toString(),
      name: newInstanceName,
      amount: amount,
      paidBy: user?.id || '1',
      paidByName: user?.name || 'John Doe',
      participants: outing?.participants || [user?.id || '1'],
      participantNames: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      createdAt: new Date().toISOString(),
      description: newInstanceDescription
    };

    setInstances(prev => [newInstance, ...prev]);
    setNewInstanceName('');
    setNewInstanceAmount('');
    setNewInstanceDescription('');
    setIsCreateInstanceOpen(false);

    toast({
      title: "Success",
      description: `Instance "${newInstance.name}" created successfully!`
    });
  };

  const getDaysAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : `${days} days ago`;
  };

  const getTimeAgo = (date: string) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!outing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading outing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to={`/society/${outing.societyId}`}>
          <Button variant="ghost" size="sm" className="mr-4 hover-pink">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{outing.name}</h1>
          <p className="text-muted-foreground">
            Created by {outing.createdByName} • {getDaysAgo(outing.createdAt)}
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold text-primary">${outing.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-accent mr-3" />
              <div>
                <p className="text-2xl font-bold text-accent">{instances.length}</p>
                <p className="text-sm text-muted-foreground">Instances</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-foreground mr-3" />
              <div>
                <p className="text-2xl font-bold">{outing.participants.length}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-foreground mr-3" />
              <div>
                <p className="text-2xl font-bold">
                  <Badge className={`${outing.status === 'ongoing' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                    {outing.status}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Instances */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Instances</h2>
            <Dialog open={isCreateInstanceOpen} onOpenChange={setIsCreateInstanceOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-background hover-pink-bg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Instance
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Add New Instance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="instance-name">Instance Name</Label>
                    <Input
                      id="instance-name"
                      placeholder="e.g., Restaurant Bill, Gas Money"
                      value={newInstanceName}
                      onChange={(e) => setNewInstanceName(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instance-amount">Amount ($)</Label>
                    <Input
                      id="instance-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newInstanceAmount}
                      onChange={(e) => setNewInstanceAmount(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instance-description">Description (Optional)</Label>
                    <Input
                      id="instance-description"
                      placeholder="Additional details..."
                      value={newInstanceDescription}
                      onChange={(e) => setNewInstanceDescription(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateInstance} 
                    className="w-full bg-primary hover:bg-primary/90 text-background"
                  >
                    Add Instance
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {instances.map((instance) => (
              <Card key={instance.id} className="hover-lift bg-card/50 border-border/30 hover:border-primary/40">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{instance.name}</h3>
                      {instance.description && (
                        <p className="text-sm text-muted-foreground mb-2">{instance.description}</p>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <User className="mr-1 h-4 w-4" />
                        Paid by {instance.paidByName}
                        <Clock className="ml-3 mr-1 h-4 w-4" />
                        {getTimeAgo(instance.createdAt)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Users className="inline mr-1 h-4 w-4" />
                        Participants: {instance.participantNames.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${instance.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {instance.participants.length} participants
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      Split: ${(instance.amount / instance.participants.length).toFixed(2)} each
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                      Split between {instance.participants.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {instances.length === 0 && (
              <Card className="bg-card/50 border-dashed border-border">
                <CardContent className="p-8 text-center">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No instances yet</p>
                  <p className="text-sm text-muted-foreground">
                    Add your first expense to start tracking costs for this outing.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* My Bill Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Bill Summary</h2>
          {currentUserSummary && (
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUserSummary.avatar} alt={currentUserSummary.name} />
                    <AvatarFallback>{currentUserSummary.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{currentUserSummary.name}</p>
                    <p className="text-sm text-muted-foreground">You</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You Paid:</span>
                    <span className="text-primary font-medium">${currentUserSummary.totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You Owe:</span>
                    <span className="text-accent font-medium">${currentUserSummary.totalOwed.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-border/30 pt-2">
                    <span>Your Balance:</span>
                    <span className={currentUserSummary.balance >= 0 ? 'text-primary' : 'text-[#FF0099]'}>
                      {currentUserSummary.balance >= 0 ? '+' : ''}${currentUserSummary.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Outing;
