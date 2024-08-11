'use client';

import WaitlistPage from './waitlist-front/page';

import { usePathname } from 'next/navigation';

const Page = () => {
    const pathname = usePathname();

    return <WaitlistPage />;
};

export default Page;

