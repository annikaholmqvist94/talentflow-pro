import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Briefcase, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Please enter both email and password');
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('🔵 Attempting login with:', email);
            const success = await login(email, password);

            console.log('🔵 Login result:', success);

            if (success) {
                console.log('✅ Login successful! Navigating to /');
                navigate('/', { replace: true });
            } else {
                console.log('❌ Login failed (success = false)');
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error('❌ Login exception:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-4 text-center pb-2">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Briefcase className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">Mini-ATS</CardTitle>
                        <CardDescription className="mt-1">
                            Sign in to your account to continue
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="h-11"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="h-11"
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                        <p className="font-medium mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs">
                            <p>Email: admin@acme.com</p>
                            <p>Password: Admin123!</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}