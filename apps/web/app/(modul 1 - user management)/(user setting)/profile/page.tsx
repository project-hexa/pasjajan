import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import { Metadata } from "next";
import { UserProfileForm } from "../../_components/user-profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <Card className="w-full p-0">
      <CardContent>
        <CardTitle className="sr-only">Profile</CardTitle>
        <CardDescription className="sr-only">Profile Customer</CardDescription>
        <div className="h-full">
          <UserProfileForm />
        </div>
      </CardContent>
    </Card>
  );
}
