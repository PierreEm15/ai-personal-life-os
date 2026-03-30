import { redirect } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();
  redirect({ href: '/dashboard', locale });
}
