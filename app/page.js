'use client';

import LandingPage from './landing/page';
import Waitlist from './waitlist-front/page';
import AboutPage from './about/page';
import { usePathname } from 'next/navigation';

const Page = () => {
    const pathname = usePathname();

    if (pathname === '/waitlist-front') {
        return <Waitlist />;
    }

    if (pathname === '/about') {
        return <Waitlist />;
    }

    return <LandingPage />;
};

export default Page;
