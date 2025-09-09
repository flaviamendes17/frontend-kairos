'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="container">
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Redirecionando para o dashboard...</p>
      </div>
    </div>
  );
}