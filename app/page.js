'use client';

import LandingPage from './landing/page';
import Waitlist from './waitlist-front/page';
import { usePathname } from 'next/navigation';

const Page = () => {
    const pathname = usePathname();

    if (pathname === '/waitlist-front') {
        return <Waitlist />;
    }


    return <LandingPage />;
};

export default Page;