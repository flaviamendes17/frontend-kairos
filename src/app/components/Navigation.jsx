'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import './navigation.css';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/tarefas', label: 'Tarefas', icon: '📝' },
    { href: '/insights', label: 'Insights', icon: '📈' },
    { href: '/sobre-mim', label: 'Sobre Mim', icon: '👤' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/dashboard" className="nav-logo">
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
