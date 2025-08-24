import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const userId = cookies().get('userId')?.value;
  if (!userId) {
    redirect('/login');
  }
  redirect('/movie');
}
