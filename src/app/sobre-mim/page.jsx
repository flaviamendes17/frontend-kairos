'use client';

import { useState, useEffect } from 'react';
import './sobre-mim.css';

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
    <div className="sobre-mim-page">
      {/* Perfil do Usuário */}
      <div className="profile-section">
        <div className="profile-container">
          <div className="avatar-section">
            <img
              src="/images/eu.jpg"
              alt="Foto de Flavia Mendes"
              className="avatar-img"
            />
          </div>
          <div className="profile-content">
            <h2>Flavia Mendes</h2>
            <div className="name-underline"></div>
            <p className="profile-role">Estudante | Organização Pessoal</p>
            <p className="profile-description">
              Estudante do último semestre de desenvolvimento de sistemas, criei o Kairos para aprimorar minha organização pessoal e ajudar outros estudantes a gerenciarem melhor seu tempo e tarefas. Além de servir como um projeto de encerramento do curso.
            </p>
            <div className="profile-highlights">
              <div className="highlight-item">
                <span>Estudante de Desenvolvimento de Sistemas</span>
              </div>
              <div className="highlight-item">
                <span>Criadora do sistema Kairos</span>
              </div>
              <div className="highlight-item">
                <span>Desenvolvedora Full Stack</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Pessoais */}
      {stats && (
        <div className="personal-stats">
          <h2>Minhas Estatísticas</h2>
          <div className="stats-grid">
            <div className="stat-card achievement">
              <div className="stat-content">
                <h3>Taxa de Sucesso</h3>
                <div className="stat-number">{stats.taxaSucesso}%</div>
                <p>Das tarefas são concluídas</p>
              </div>
            </div>

            <div className="stat-card productivity">
              <div className="stat-content">
                <h3>Produtividade</h3>
                <div className="stat-number">{stats.mediaTarefasPorDia}</div>
                <p>Tarefas por dia ativo</p>
              </div>
            </div>

            <div className="stat-card streak">
              <div className="stat-content">
                <h3>Sequência Atual</h3>
                <div className="stat-number">{stats.sequenciaAtual}</div>
                <p>Dias consecutivos ativos</p>
              </div>
            </div>

            <div className="stat-card total">
              <div className="stat-content">
                <h3>Total Concluído</h3>
                <div className="stat-number">{stats.tarefasConcluidas}</div>
                <p>Tarefas finalizadas</p>
              </div>
            </div>
          </div>
        </div>
      )}

        <div className="timeline-container">
        <div className="timeline-item">
          <div className="timeline-dot purple"></div>
          <div className="timeline-content">
            <h3>Sobre o Kairos</h3>
            <p>
              Kairos é um sistema de gerenciamento de tempo focado na produtividade 
              e organização pessoal. O nome "Kairos" vem do grego antigo e significa 
              "momento certo" ou "tempo oportuno".
            </p>
          </div>
          <div className="timeline-decoration">
            <div className="decoration-circle">⏰</div>
            <div className="decoration-text">Momento Certo</div>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot blue"></div>
          <div className="timeline-content">
            <h3>Objetivos</h3>
            <div className="timeline-objectives">
              <div className="objective-item">
                <span className="objective-icon">🎯</span>
                <span>Organizar tarefas de estudo de forma eficiente</span>
              </div>
              <div className="objective-item">
                <span className="objective-icon">📈</span>
                <span>Acompanhar progresso e produtividade</span>
              </div>
              <div className="objective-item">
                <span className="objective-icon">🔍</span>
                <span>Identificar padrões e oportunidades de melhoria</span>
              </div>
              <div className="objective-item">
                <span className="objective-icon">🎪</span>
                <span>Manter foco nos objetivos pessoais</span>
              </div>
            </div>
          </div>
          <div className="timeline-decoration">
            <div className="decoration-stats">
              <div className="mini-stat">
                <span className="mini-number">4</span>
                <span className="mini-label">Metas</span>
              </div>
              <div className="mini-stat">
                <span className="mini-number">100%</span>
                <span className="mini-label">Foco</span>
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot green"></div>
          <div className="timeline-content">
            <h3>Funcionalidades</h3>
            <div className="timeline-features">
              <div className="feature-timeline-item">
                <div className="feature-timeline-icon">📊</div>
                <div className="feature-timeline-text">
                  <strong>Dashboard</strong>
                  <span>Visão geral do progresso e métricas importantes</span>
                </div>
              </div>
              <div className="feature-timeline-item">
                <div className="feature-timeline-icon">✅</div>
                <div className="feature-timeline-text">
                  <strong>Tarefas</strong>
                  <span>Gerenciamento completo de atividades e projetos</span>
                </div>
              </div>
              <div className="feature-timeline-item">
                <div className="feature-timeline-icon">📈</div>
                <div className="feature-timeline-text">
                  <strong>Insights</strong>
                  <span>Análises detalhadas e métricas de desempenho</span>
                </div>
              </div>
              <div className="feature-timeline-item">
                <div className="feature-timeline-icon">👤</div>
                <div className="feature-timeline-text">
                  <strong>Perfil</strong>
                  <span>Informações pessoais e estatísticas individuais</span>
                </div>
              </div>
            </div>
          </div>
          <div className="timeline-decoration">
            <div className="decoration-tech">
              <div className="tech-item">React</div>
              <div className="tech-item">CSS3</div>
              <div className="tech-item">Next.js</div>
            </div>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot orange"></div>
          <div className="timeline-content">
            <h3>Status da Conexão</h3>
            {data && (
              <div className="timeline-status">
                <div className="status-timeline-item">
                  <div className="status-timeline-label">Status do Banco:</div>
                  <div className={`status-timeline-indicator ${data.database_connected ? 'connected' : 'disconnected'}`}>
                    <div className="status-timeline-dot"></div>
                    <span>{data.database_connected ? 'Conectado' : 'Desconectado'}</span>
                  </div>
                </div>
                <div className="status-timeline-item">
                  <div className="status-timeline-label">Última Atualização:</div>
                  <div className="status-timeline-time">
                    {new Date(data.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="timeline-decoration">
            <div className="decoration-progress">
              <div className="circular-progress">
                <div className="circle-bg">
                  <div className="circle-fill" style={{'--progress': data?.database_connected ? '100%' : '0%'}}></div>
                  <span className="circle-text">{data?.database_connected ? '✅' : '❌'}</span>
                </div>
                <div className="progress-label">Conexão</div>
              </div>
            </div>
          </div>
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
