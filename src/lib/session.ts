import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

export async function getUserId() {
  const session = await requireAuth();
  return (session.user as unknown as { id: string }).id;
}
