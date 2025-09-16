'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      {/* Header da Página Inicial */}
      <div className="header">
        <h1>Bem-vindo ao Kairos</h1>
        <p>Sistema prático, acessível e elegante para gerenciamento de tempo e tarefas</p>
        <div className="divider"></div>
      </div>

      <div className="intro-section">
        <div className="intro-card">
          <h2>Organize seu tempo, alcance seus objetivos</h2>
          <p>
            O Kairos é sua ferramenta completa para gerenciamento de tempo e produtividade. 
            Controle suas tarefas, acompanhe seu progresso e tenha insights valiosos sobre 
            como você utiliza seu tempo.
          </p>
        </div>
      </div>

      {/* Cards de Funcionalidades */}
      <div className="features-grid">
        <div className="feature-card">
          <img src='/icon/dashboard.png' alt='Dashboard Icon' className='feature-icon'style={{ width: 55, height: 55 }}/>
          <h3>Dashboard Inteligente</h3>
          <p>Visualize todas suas métricas de produtividade em um só lugar</p>
          <Link href="/dashboard" className="btn">
            Ir para Dashboard
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Gestão de Tarefas</h3>
          <p>Organize, priorize e acompanhe o progresso de todas suas atividades</p>
          <Link href="/tarefas" className="btn">
            Gerenciar Tarefas
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Insights Detalhados</h3>
          <p>Análises profundas sobre seus padrões de trabalho e produtividade</p>
          <Link href="/insights" className="btn">
            Ver Insights
          </Link>
        </div>
      
        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Perfil Personalizado</h3>
          <p>Configure suas preferências e acompanhe suas conquistas</p>
          <Link href="/sobre-mim" className="btn">
            Meu Perfil
          </Link>
        </div>
      </div>
      {/* mudar emoji para icon (excedi o limite de baixar icones) )} */}

      <div className="cta-section">
        <div className="cta-card">
          <h2>🚀 Pronto para começar?</h2>
          <p>Comece agora a organizar sua vida e aumentar sua produtividade</p>
          <Link href="/dashboard" className="btn btn-primary">
            Acessar Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}