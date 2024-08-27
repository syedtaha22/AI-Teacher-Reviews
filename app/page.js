'use client';

import LandingPage from './landing/page';
import Waitlist from './waitlist/page';
import AboutPage from './about/page';
import ThankYouPage from './post-submission/page';
import { usePathname } from 'next/navigation';
import ReviewPage from './review-page/page'
import FeedbackForm from './feedback/page';

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

    if (pathname === '/review-page') {
        return <ReviewPage />;
    }

    if (pathname === '/feedback') {
        return <FeedbackForm />;
    }

    return <LandingPage />;
};

export default Page;
