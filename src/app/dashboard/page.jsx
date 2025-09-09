'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
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
            description: "Revisar conceitos de async/await",
            status: "em-andamento",
            priority: "alta",
            due_date: "2025-09-10",
            created_at: "2025-09-08T10:00:00Z"
          },
          {
            id: 2,
            title: "Ler documentação React",
            description: "Estudar hooks avançados",
            status: "pendente",
            priority: "media",
            due_date: "2025-09-12",
            created_at: "2025-09-07T14:30:00Z"
          },
          {
            id: 3,
            title: "Projeto final",
            description: "Finalizar sistema Kairos",
            status: "completa",
            priority: "alta",
            due_date: "2025-09-09",
            created_at: "2025-09-05T09:00:00Z"
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
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
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
      
      // Usar dados de exemplo quando a API não estiver disponível
      const exampleData = getExampleData();
      setData(exampleData);
      
      // Definir erro mais amigável
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

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchKairosData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchKairosData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calcular estatísticas das tarefas
  const getTaskStats = () => {
    if (!data?.data?.tasks?.all) return { 
      total: 0, 
      completas: 0, 
      pendentes: 0, 
      emAndamento: 0,
      hoje: 0,
      atrasadas: 0 
    };
    
    const tasks = data.data.tasks.all;
    const hoje = new Date().toDateString();
    
    return {
      total: tasks.length,
      completas: tasks.filter(t => t.status === 'completa').length,
      pendentes: tasks.filter(t => t.status === 'pendente').length,
      emAndamento: tasks.filter(t => t.status === 'em-andamento').length,
      hoje: tasks.filter(t => new Date(t.due_date).toDateString() === hoje).length,
      atrasadas: tasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completa').length,
    };
  };

  // Obter tarefas recentes (últimas 5)
  const getRecentTasks = () => {
    if (!data?.data?.tasks?.all) return [];
    return [...data.data.tasks.all]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  };

  const stats = getTaskStats();
  const recentTasks = getRecentTasks();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header do Dashboard */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral do progresso diário, semanal e mensal</p>
        <div className="page-actions">
          <button className="btn" onClick={fetchKairosData} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {/* Banner de aviso para dados de exemplo */}
      {data && !data.database_connected && error && (
        <div className="warning-banner">
          <span className="icon">⚠️</span>
          <div>
            <strong>Modo Demonstração:</strong> A API não está disponível. 
            Os dados exibidos são exemplos para demonstrar as funcionalidades do sistema.
          </div>
        </div>
      )}

      {/* Status de Conexão */}
      <div className="status-section">
        <div className="status-indicator">
          <div className={`status-dot ${!data?.database_connected ? 'disconnected' : ''}`}></div>
          <span>
            {data?.database_connected ? 'Sistema Conectado' : 'Sistema Desconectado'}
          </span>
          <span className={`api-status ${!data?.database_connected ? 'demo' : ''}`}>
            {!data?.database_connected ? '📋 Dados de exemplo' : '🔗 API conectada'}
          </span>
          {data?.timestamp && (
            <small>• Última atualização: {new Date(data.timestamp).toLocaleString('pt-BR')}</small>
          )}
        </div>
      </div>

      {/* Dashboard de Estatísticas */}
      <div className="dashboard fade-in">
        <div className="stat-card priority">
          <h3>Tarefas de Hoje</h3>
          <div className="number">{stats.hoje}</div>
          <small>Prazo para hoje</small>
        </div>
        <div className="stat-card">
          <h3>Total de Tarefas</h3>
          <div className="number">{stats.total}</div>
          <small>No sistema</small>
        </div>
        <div className="stat-card success">
          <h3>Concluídas</h3>
          <div className="number">{stats.completas}</div>
          <small>Finalizadas</small>
        </div>
        <div className="stat-card warning">
          <h3>Em Andamento</h3>
          <div className="number">{stats.emAndamento}</div>
          <small>Sendo executadas</small>
        </div>
        <div className="stat-card pending">
          <h3>Pendentes</h3>
          <div className="number">{stats.pendentes}</div>
          <small>Aguardando início</small>
        </div>
        <div className="stat-card danger">
          <h3>Atrasadas</h3>
          <div className="number">{stats.atrasadas}</div>
          <small>Prazo vencido</small>
        </div>
      </div>

      {/* Gráfico de Progresso */}
      <div className="progress-section">
        <div className="progress-card">
          <h3>Progresso Geral</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${stats.total > 0 ? (stats.completas / stats.total) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <p>{stats.total > 0 ? Math.round((stats.completas / stats.total) * 100) : 0}% das tarefas concluídas</p>
        </div>
      </div>

      {/* Tarefas Recentes */}
      {recentTasks.length > 0 && (
        <div className="recent-tasks">
          <h2>Tarefas Recentes</h2>
          <div className="task-list">
            {recentTasks.map((task, index) => (
              <div key={task.id || index} className="task-preview">
                <div className="task-preview-header">
                  <h4>{task.title}</h4>
                  <span className={`task-status ${task.status}`}>
                    {task.status}
                  </span>
                </div>
                <p className="task-preview-description">{task.description}</p>
                <div className="task-preview-meta">
                  <span>📅 {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                  <span>⚡ {task.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links Rápidos */}
      <div className="quick-links">
        <h2>Acesso Rápido</h2>
        <div className="link-grid">
          <a href="/tarefas" className="quick-link">
            <span className="link-icon">📝</span>
            <div>
              <h3>Gerenciar Tarefas</h3>
              <p>Criar, editar e organizar tarefas</p>
            </div>
          </a>
          <a href="/insights" className="quick-link">
            <span className="link-icon">📈</span>
            <div>
              <h3>Ver Estatísticas</h3>
              <p>Gráficos e métricas de desempenho</p>
            </div>
          </a>
          <a href="/sobre-mim" className="quick-link">
            <span className="link-icon">👤</span>
            <div>
              <h3>Perfil</h3>
              <p>Informações pessoais e configurações</p>
            </div>
          </a>
        </div>
      </div>

      {error && (
        <div className="error">
          <strong>Erro ao carregar dados:</strong> {error}
        </div>
      )}
    </div>
  );
}
