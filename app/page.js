'use client';

import LandingPage from './landing/page';
import Waitlist from './waitlist/page';
import AboutPage from './about/page';
import ThankYouPage from './post-submission/page';
import { usePathname } from 'next/navigation';

const Page = () => {
    const pathname = usePathname();

    if (pathname === '/waitlist') {
        return <Waitlist />;
    }

    if (pathname === '/about') {
        return <AboutPage />;
    }

    if (pathname === '/post-submission') {
        return <ThankYouPage />;
    }

    return <LandingPage />;
};

export default Page;
