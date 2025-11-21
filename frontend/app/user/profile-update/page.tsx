'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthCheck from '@/components/AuthCheck';

const UpdateProfilePage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authApi.getProfile();
        setFirstName(userData.data.firstName);
        setLastName(userData.data.lastName);
        setEmail(userData.data.email);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ firstName, lastName });
      router.push('/user/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <AuthCheck>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Profile
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  );
};

export default UpdateProfilePage;
