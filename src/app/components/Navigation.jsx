'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import './navigation.css';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'DASHBOARD'},
    { href: '/tarefas', label: 'TAREFAS'},
    { href: '/insights', label: 'INSIGHTS'},
    { href: '/sobre-mim', label: 'SOBRE MIM'},
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/" className="nav-logo">
            <Image 
              src="/icon/ampulheta-semfundo.png" 
              alt="Kairos Logo" 
              width={100}
              height={100}
              className="logo-image"
              priority
            />
            <span className="logo-text">KAIROS</span>
          </Link>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
