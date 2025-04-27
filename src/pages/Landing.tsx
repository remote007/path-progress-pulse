
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Landing = () => {
  const features = [
    'Personalized learning roadmaps',
    'Expert-curated resources',
    'Progress tracking',
    'Community discussions',
    'Earn badges and XP'
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Master New Skills with
                  <span className="text-primary"> Path</span>
                  <span className="text-secondary">Pulse</span>
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  Personalized learning paths designed to help you achieve your goals.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">Login</Button>
                </Link>
              </div>
              
              <div className="pt-4">
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-secondary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="rounded-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">
              Follow these simple steps to start your learning journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '1. Create Your Profile',
                description: 'Sign up and tell us your interests and learning goals.'
              },
              {
                title: '2. Get Personalized Roadmap',
                description: 'Receive a custom learning path based on your goals and available time.'
              },
              {
                title: '3. Track Your Progress',
                description: 'Complete resources, earn XP, and track your growth over time.'
              }
            ].map((step, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners already on their path to success.
          </p>
          <Link to="/signup">
            <Button size="lg">Create Your Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
