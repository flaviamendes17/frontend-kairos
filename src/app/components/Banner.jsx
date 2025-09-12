'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Banner = () => {
const pathname = usePathname();

  // Só mostra o banner na página inicial
if (pathname !== '/') {
    return null;
}

    return (
    <div className="banner-section">
    <Image 
        src="/images/banner.png" 
        alt="Banner Kairos" 
        className="banner-image"
        width={1200}
        height={300}
        priority
    />
    </div>
);
};

export default Banner;
