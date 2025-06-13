
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Users, Calendar, DollarSign, ArrowRight, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  
  if (user) {
    return <Navigate to="/societies" replace />;
  }

  const features = [
    {
      icon: Users,
      title: "Create Societies",
      description: "Build communities with friends and manage group activities effortlessly"
    },
    {
      icon: Calendar,
      title: "Plan Outings",
      description: "Organize group events and keep everyone in the loop"
    },
    {
      icon: DollarSign,
      title: "Track Expenses",
      description: "Split costs fairly and never lose track of who owes what"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is protected with enterprise-grade security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Compass className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">Compass</span>
        </div>
        <Button 
          onClick={signInWithGoogle}
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <main className="px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center py-20">
          <div className="mb-8">
            <Compass className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Navigate Your
              <span className="gradient-text block">Group Finances</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Create societies, plan outings, and split expenses seamlessly. 
              Never argue about money again with intelligent expense tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={signInWithGoogle}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-primary/30 hover:border-primary"
            >
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift glass-effect bg-card/50">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$2M+</div>
              <div className="text-muted-foreground">Expenses Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Outings Organized</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6 lg:px-8 mt-20">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="h-6 w-6 text-primary" />
            <span className="font-semibold">Compass</span>
          </div>
          <p>&copy; 2024 Compass. Navigate your finances with friends.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
