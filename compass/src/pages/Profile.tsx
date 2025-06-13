
import { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface UserStats {
  totalSocieties: number;
  totalOutings: number;
  totalSpent: number;
  societyData: Array<{
    name: string;
    outings: number;
    color: string;
  }>;
}

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // Mock user statistics
    const mockStats: UserStats = {
      totalSocieties: 3,
      totalOutings: 24,
      totalSpent: 1845.50,
      societyData: [
        { name: 'College Friends', outings: 12, color: '#FF003F' },
        { name: 'Office Team', outings: 8, color: '#4D4949' },
        { name: 'Sports Club', outings: 4, color: '#FF6B6B' }
      ]
    };
    setStats(mockStats);
  }, []);

  const getDaysAgo = (date: string) => {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    return days;
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
    
    // Mock outing dates for different societies
    const outingDates = [
      { day: 5, society: 'College Friends' },
      { day: 12, society: 'Office Team' },
      { day: 18, society: 'College Friends' },
      { day: 25, society: 'Sports Club' }
    ];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const outingOnDay = outingDates.find(o => o.day === day);
      const isToday = day === today.getDate();
      
      let bgColor = '';
      if (outingOnDay) {
        if (outingOnDay.society === 'College Friends') bgColor = 'bg-primary/20 border-primary';
        else if (outingOnDay.society === 'Office Team') bgColor = 'bg-secondary/20 border-secondary';
        else bgColor = 'bg-red-500/20 border-red-500';
      }
      
      days.push(
        <div
          key={day}
          className={`p-2 text-center text-sm border rounded ${
            outingOnDay 
              ? `${bgColor} text-primary font-semibold` 
              : 'border-border/30'
          } ${
            isToday ? 'ring-2 ring-primary/50' : ''
          }`}
          title={outingOnDay ? `${outingOnDay.society} outing` : ''}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  if (!user || !stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Joined {getDaysAgo(user.joinedDate)} days ago
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSocieties}</p>
                <p className="text-sm text-muted-foreground">Societies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalOutings}</p>
                <p className="text-sm text-muted-foreground">Outings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">${stats.totalSpent}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{Math.round(stats.totalSpent / stats.totalOutings)}</p>
                <p className="text-sm text-muted-foreground">Avg per Outing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Societies */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>My Societies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.societyData.map((society, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: society.color }}
                    ></div>
                    <span className="font-medium">{society.name}</span>
                  </div>
                  <Badge variant="outline">{society.outings} outings</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Calendar */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Activity Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {generateCalendar()}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary/20 border border-primary mr-2"></div>
                <span className="text-muted-foreground">College Friends</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary/20 border border-secondary mr-2"></div>
                <span className="text-muted-foreground">Office Team</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500/20 border border-red-500 mr-2"></div>
                <span className="text-muted-foreground">Sports Club</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Society Statistics Chart */}
      <Card className="bg-card/50 mt-8">
        <CardHeader>
          <CardTitle>Outings by Society</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.societyData.map((society, index) => {
              const percentage = (society.outings / stats.totalOutings) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{society.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {society.outings} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: society.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
