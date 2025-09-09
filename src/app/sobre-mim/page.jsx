'use client';

import { useState, useEffect } from 'react';

export default function SobreMim() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dados de exemplo para quando a API não estiver disponível
  const getExampleData = () => ({
    message: "📊 API Kairos - Dados de exemplo",
    timestamp: new Date().toISOString(),
    database_connected: false,
    data: {
      tasks: {
        all: [
          {
            id: 1,
            title: "Estudar JavaScript",
            description: "Conceitos avançados",
            status: "completa",
            priority: "alta",
            due_date: "2025-09-08",
            created_at: "2025-09-06T10:00:00Z"
          },
          {
            id: 2,
            title: "React Hooks",
            description: "useState, useEffect",
            status: "completa",
            priority: "media",
            due_date: "2025-09-07",
            created_at: "2025-09-05T14:30:00Z"
          },
          {
            id: 3,
            title: "CSS Grid",
            description: "Layouts responsivos",
            status: "completa",
            priority: "baixa",
            due_date: "2025-09-06",
            created_at: "2025-09-04T16:00:00Z"
          },
          {
            id: 4,
            title: "Algoritmos",
            description: "Estruturas de dados",
            status: "completa",
            priority: "media",
            due_date: "2025-09-05",
            created_at: "2025-09-03T11:00:00Z"
          },
          {
            id: 5,
            title: "Next.js",
            description: "Server components",
            status: "em-andamento",
            priority: "alta",
            due_date: "2025-09-12",
            created_at: "2025-09-08T09:00:00Z"
          },
          {
            id: 6,
            title: "TypeScript",
            description: "Tipagem estática",
            status: "pendente",
            priority: "media",
            due_date: "2025-09-15",
            created_at: "2025-09-08T15:00:00Z"
          }
        ]
      }
    }
  });

  // Função para buscar dados da API
  const fetchKairosData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:3000/api/kairos', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.warn('API não disponível, usando dados de exemplo:', err.message);
      
      const exampleData = getExampleData();
      setData(exampleData);
      
      if (err.name === 'AbortError') {
        setError('Timeout: API demorou muito para responder');
      } else if (err.message.includes('fetch')) {
        setError('API não está rodando. Usando dados de exemplo.');
      } else {
        setError(`Erro de conexão: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKairosData();
  }, []);

  // Calcular estatísticas pessoais
  const getPersonalStats = () => {
    if (!data?.data?.tasks?.all) return null;
    
    const tasks = data.data.tasks.all;
    const completas = tasks.filter(t => t.status === 'completa');
    
    // Calcular produtividade diária
    const tasksPorDia = {};
    completas.forEach(task => {
      const dataTask = new Date(task.created_at).toDateString();
      tasksPorDia[dataTask] = (tasksPorDia[dataTask] || 0) + 1;
    });
    
    const diasAtivos = Object.keys(tasksPorDia).length;
    const mediaTarefasPorDia = diasAtivos > 0 ? Math.round((completas.length / diasAtivos) * 10) / 10 : 0;
    
    // Calcular sequência atual
    let sequenciaAtual = 0;
    const hoje = new Date();
    for (let i = 0; i < 30; i++) {
      const dataCheck = new Date(hoje);
      dataCheck.setDate(dataCheck.getDate() - i);
      const dataStr = dataCheck.toDateString();
      
      if (tasksPorDia[dataStr]) {
        sequenciaAtual++;
      } else {
        break;
      }
    }
    
    return {
      totalTarefas: tasks.length,
      tarefasConcluidas: completas.length,
      diasAtivos,
      mediaTarefasPorDia,
      sequenciaAtual,
      taxaSucesso: tasks.length > 0 ? Math.round((completas.length / tasks.length) * 100) : 0
    };
  };

  const stats = getPersonalStats();

  return (
    <div className="container">
      {/* Header da página */}
      <div className="page-header">
        <h1>Sobre Mim</h1>
        <div className="page-actions">
        </div>
      </div>

      {/* Perfil do Usuário */}
      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <h2>Flavia Mendes</h2>
            <p className="profile-role">Estudante | Organização Pessoal</p>
            <p className="profile-description">
            Estudante do último semestre de desenvolvimento de sistemas, criei o Kairos para aprimorar minha organização pessoal e ajudar outros estudantes a gerenciarem melhor seu tempo e tarefas.
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas Pessoais */}
      {stats && (
        <div className="personal-stats">
          <h2>Minhas Estatísticas</h2>
          <div className="stats-grid">
            <div className="stat-card achievement">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3>Taxa de Sucesso</h3>
                <div className="stat-number">{stats.taxaSucesso}%</div>
                <p>Das tarefas são concluídas</p>
              </div>
            </div>

            <div className="stat-card productivity">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Produtividade</h3>
                <div className="stat-number">{stats.mediaTarefasPorDia}</div>
                <p>Tarefas por dia ativo</p>
              </div>
            </div>

            <div className="stat-card streak">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>Sequência Atual</h3>
                <div className="stat-number">{stats.sequenciaAtual}</div>
                <p>Dias consecutivos ativos</p>
              </div>
            </div>

            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Concluído</h3>
                <div className="stat-number">{stats.tarefasConcluidas}</div>
                <p>Tarefas finalizadas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações do Sistema */}
      <div className="system-info">
        <h2>Informações do Sistema</h2>
        <div className="info-cards">
          <div className="info-card">
            <h3>🕐 Sobre o Kairos</h3>
            <p>
              Kairos é um sistema de gerenciamento de tempo focado na produtividade 
              e organização pessoal. O nome "Kairos" vem do grego antigo e significa 
              "momento certo" ou "tempo oportuno".
            </p>
          </div>

          <div className="info-card">
            <h3>🎯 Objetivos</h3>
            <ul>
              <li>Organizar tarefas de estudo de forma eficiente</li>
              <li>Acompanhar progresso e produtividade</li>
              <li>Identificar padrões e oportunidades de melhoria</li>
              <li>Manter foco nos objetivos pessoais</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>💡 Funcionalidades</h3>
            <ul>
              <li><strong>Dashboard:</strong> Visão geral do progresso</li>
              <li><strong>Tarefas:</strong> Gerenciamento completo de atividades</li>
              <li><strong>Insights:</strong> Análises e métricas de desempenho</li>
              <li><strong>Perfil:</strong> Informações pessoais e estatísticas</li>
            </ul>
          </div>

          {data && (
            <div className="info-card">
              <h3>🔗 Status da Conexão</h3>
              <div className="connection-status">
                <div className="status-row">
                  <span>Status do Banco:</span>
                  <span className={`status-badge ${data.database_connected ? 'connected' : 'disconnected'}`}>
                    {data.database_connected ? '✅ Conectado' : '❌ Desconectado'}
                  </span>
                </div>
                <div className="status-row">
                  <span>Última Atualização:</span>
                  <span>{new Date(data.timestamp).toLocaleString('pt-BR')}</span>
                </div>
                <div className="status-row">
                  <span>API Endpoint:</span>
                  <span className="endpoint">http://localhost:3000/api/kairos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>



            

           

           


        

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando informações...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Erro ao carregar dados:</strong> {error}
        </div>
      )}
    </div>
  );
}
