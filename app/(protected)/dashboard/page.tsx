import { onboardUser } from "@/actions/user";
import { redirect } from "next/navigation";

type Props = {};

async function Page({}: Props) {
  try {
    const user = await onboardUser();

    if (user.status === 200 || user.status === 201) {
      // Use a default name if firstname/lastname are undefined
      const firstName = user.data?.firstname || 'user';
      const lastName = user.data?.lastname || '';
      return redirect(`/dashboard/${firstName}${lastName}`);
    }

    // Fallback to simple page if there's an error with user data
    return redirect('/dashboard/simple-page');
  } catch (error) {
    console.error('Error in dashboard page:', error);
    // Provide a fallback path if onboardUser fails completely
    return redirect('/dashboard/simple-page');
  }
}

export default Page;
