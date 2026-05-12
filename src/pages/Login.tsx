import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';
import { Eye, EyeOff, Copy, Terminal, User, ChevronUp, ChevronDown } from 'lucide-react';
import { TEST_USERS, seedTestUsers } from '../scripts/seedUsers';

export function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const user = useAppStore((state) => state.user);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [showDevHelper, setShowDevHelper] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
      // navigation happens automatically via the state change effect
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.message) {
        try {
          const parsedError = JSON.parse(err.message);
          if (parsedError.error && typeof parsedError.error === 'string') {
            if (parsedError.error.includes('auth/invalid-credential')) {
              errorMessage = 'Invalid email or password.';
            } else if (parsedError.error.includes('auth/user-not-found')) {
              errorMessage = 'No user found with this email.';
            } else if (parsedError.error.includes('auth/wrong-password')) {
              errorMessage = 'Incorrect password.';
            } else if (parsedError.error.includes('auth/too-many-requests')) {
              errorMessage = 'Too many attempts. Please try again later.';
            } else {
              errorMessage = parsedError.error.replace('Firebase: Error ', '').replace(/[()]/g, '');
            }
          }
        } catch(e) {
          if (err.message.includes('auth/')) {
            errorMessage = 'Invalid email or password.';
          } else {
            errorMessage = err.message;
          }
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedTestUsers();
      // Quick refresh to clear auth state noise from rapid account creation
      window.location.reload();
    } catch(e) {
      console.error(e);
      setSeeding(false);
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setEmail(email);
    setPassword(pass);
  };

  return (
    <div className="min-h-[100dvh] bg-muted/30 flex flex-col lg:flex-row items-center justify-center p-4 py-12 lg:py-8 relative gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm flex-none"
      >
        <Card className="w-full shadow-2xl border-0 ring-1 ring-border/50">
          <CardHeader className="space-y-2 text-center pb-8 pt-8">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
              S
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  required
                />
              </div>
              <div className="space-y-2 text-left relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    title={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit"
                className="w-full h-11 mt-2" 
                variant="default"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Signing in...
                  </div>
                ) : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <p className="text-sm text-muted-foreground text-center">
              Having trouble? Contact IT Support at <br/>
              <span className="font-medium text-foreground">support@school.edu</span>
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      {(import.meta as any).env.DEV && (
        <div className="w-full max-w-sm flex-none lg:fixed lg:right-4 lg:bottom-4 z-50">
          <Card className="shadow-xl border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="pb-3 pt-4 pr-3 cursor-pointer lg:cursor-default" onClick={() => setShowDevHelper(!showDevHelper)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Dev Helper
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs hidden lg:flex"
                    onClick={(e) => { e.stopPropagation(); handleSeed(); }}
                    disabled={seeding}
                  >
                    {seeding ? 'Seeding...' : 'Seed Data'}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden">
                    {showDevHelper ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className={`overflow-hidden transition-all duration-300 lg:block ${showDevHelper ? 'block' : 'hidden'}`}>
              <CardContent className="space-y-3 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs lg:hidden mb-1"
                  onClick={handleSeed}
                  disabled={seeding}
                >
                  {seeding ? 'Seeding...' : 'Seed Data'}
                </Button>
                <div className="grid grid-cols-2 text-xs gap-2">
                  {TEST_USERS.map((u, i) => (
                    <Button 
                      key={i} 
                      variant="secondary" 
                      size="sm" 
                      className="justify-start gap-2 h-8"
                      onClick={() => fillCredentials(u.email, u.password)}
                    >
                      <User className="w-3 h-3 flex-none" />
                      <span className="truncate">{u.profile.role}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
