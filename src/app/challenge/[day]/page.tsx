import { redirect } from 'next/navigation';

export default function OldChallengePage({ params }: { params: { day: string } }) {
  redirect(`/day/${params.day}/easy`);
}
