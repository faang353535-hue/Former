"use client";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import AuthCheck from "@/components/AuthCheck";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from 'next/link';

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authApi.getProfile();
        setProfile(userData.data);
        if (userData.data.picture) {
          setImg(userData.data.picture);
        } else {
          setImg("/profile-user.svg");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <AuthCheck>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-lg mx-auto shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Skeleton className="w-24 h-24 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
              </div>
            ) : (
              profile && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <img
                      src={img}
                      alt="Profile Picture"
                      className="w-24 h-24 rounded-full border-4 border-primary"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {profile.firstName} {profile.lastName}
                    </h2>
                  </div>
                  <div>
                    <p className="text-lg text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>
              )
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="./profile-update"
            >
              <ShimmerButton>Edit Profile</ShimmerButton>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AuthCheck>
  );
};

export default ProfilePage;
