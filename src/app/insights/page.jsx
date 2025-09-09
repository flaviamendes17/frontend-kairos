'use client';

import { useState, useEffect } from 'react';

export default function Insights() {
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
            status: "completa",
            priority: "alta",
            due_date: "2025-09-08",
            created_at: "2025-09-06T10:00:00Z"
          },
          {
            id: 2,
            title: "Ler documentação React",
            description: "Estudar hooks avançados",
            status: "completa",
            priority: "media",
            due_date: "2025-09-07",
            created_at: "2025-09-05T14:30:00Z"
          },
          {
            id: 3,
            title: "Projeto final",
            description: "Finalizar sistema Kairos",
            status: "em-andamento",
            priority: "alta",
            due_date: "2025-09-12",
            created_at: "2025-09-04T09:00:00Z"
          },
          {
            id: 4,
            title: "Estudar CSS",
            description: "Layouts responsivos",
            status: "pendente",
            priority: "baixa",
            due_date: "2025-09-15",
            created_at: "2025-09-03T16:00:00Z"
          },
          {
            id: 5,
            title: "Algoritmos",
            description: "Estruturas de dados",
            status: "completa",
            priority: "media",
            due_date: "2025-09-06",
            created_at: "2025-09-02T11:00:00Z"
          },
          {
            id: 6,
            title: "Banco de dados",
            description: "Consultas SQL",
            status: "pendente",
            priority: "alta",
            due_date: "2025-09-05", // Atrasada
            created_at: "2025-09-01T13:00:00Z"
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

  // Calcular métricas avançadas
  const getAdvancedMetrics = () => {
    if (!data?.data?.tasks?.all) return null;
    
    const tasks = data.data.tasks.all;
    const total = tasks.length;
    const completas = tasks.filter(t => t.status === 'completa').length;
    const pendentes = tasks.filter(t => t.status === 'pendente').length;
    const emAndamento = tasks.filter(t => t.status === 'em-andamento').length;
    
    // Análise por prioridade
    const altaPrioridade = tasks.filter(t => t.priority === 'alta').length;
    const mediaPrioridade = tasks.filter(t => t.priority === 'media').length;
    const baixaPrioridade = tasks.filter(t => t.priority === 'baixa').length;
    
    // Análise de prazo
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const atrasadas = tasks.filter(t => {
      const prazo = new Date(t.due_date);
      prazo.setHours(0, 0, 0, 0);
      return prazo < hoje && t.status !== 'completa';
    }).length;
    
    const vencemHoje = tasks.filter(t => {
      const prazo = new Date(t.due_date);
      prazo.setHours(0, 0, 0, 0);
      return prazo.getTime() === hoje.getTime();
    }).length;
    
    const proximaSemana = tasks.filter(t => {
      const prazo = new Date(t.due_date);
      const proxSemana = new Date();
      proxSemana.setDate(proxSemana.getDate() + 7);
      return prazo > hoje && prazo <= proxSemana;
    }).length;
    
    // Taxa de conclusão
    const taxaConclusao = total > 0 ? Math.round((completas / total) * 100) : 0;
    
    // Produtividade (tarefas concluídas vs tempo)
    const tarefasConcluidas = tasks.filter(t => t.status === 'completa');
    const tempoMedioExecucao = tarefasConcluidas.length > 0 
      ? tarefasConcluidas.reduce((acc, task) => {
          const criacao = new Date(task.created_at);
          const agora = new Date();
          return acc + (agora - criacao) / (1000 * 60 * 60 * 24); // dias
        }, 0) / tarefasConcluidas.length
      : 0;

    return {
      total,
      completas,
      pendentes,
      emAndamento,
      altaPrioridade,
      mediaPrioridade,
      baixaPrioridade,
      atrasadas,
      vencemHoje,
      proximaSemana,
      taxaConclusao,
      tempoMedioExecucao: Math.round(tempoMedioExecucao * 10) / 10
    };
  };

  const metrics = getAdvancedMetrics();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header da página */}
      <div className="page-header">
        <h1>Insights & Estatísticas</h1>
        <p>Gráficos e métricas de desempenho com base nas tarefas concluídas</p>
        <div className="page-actions">
          <button className="btn" onClick={fetchKairosData} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {metrics ? (
        <>
          {/* Métricas Principais */}
          <div className="insights-grid">
            <div className="insight-card primary">
              <div className="insight-header">
                <h3>Taxa de Conclusão</h3>
                <span className="insight-icon">🎯</span>
              </div>
              <div className="insight-value">{metrics.taxaConclusao}%</div>
              <div className="insight-detail">
                {metrics.completas} de {metrics.total} tarefas concluídas
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${metrics.taxaConclusao}%` }}
                ></div>
              </div>
            </div>

            <div className="insight-card success">
              <div className="insight-header">
                <h3>Tempo Médio</h3>
                <span className="insight-icon">⏱️</span>
              </div>
              <div className="insight-value">{metrics.tempoMedioExecucao}</div>
              <div className="insight-detail">dias para conclusão</div>
            </div>

            <div className="insight-card warning">
              <div className="insight-header">
                <h3>Tarefas Atrasadas</h3>
                <span className="insight-icon">⚠️</span>
              </div>
              <div className="insight-value">{metrics.atrasadas}</div>
              <div className="insight-detail">prazo vencido</div>
            </div>

            <div className="insight-card info">
              <div className="insight-header">
                <h3>Vencem Hoje</h3>
                <span className="insight-icon">📅</span>
              </div>
              <div className="insight-value">{metrics.vencemHoje}</div>
              <div className="insight-detail">tarefas para hoje</div>
            </div>
          </div>

          {/* Distribuição por Status */}
          <div className="chart-section">
            <h2>Distribuição por Status</h2>
            <div className="chart-container">
              <div className="pie-chart">
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color completa"></div>
                    <span>Concluídas ({metrics.completas})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color em-andamento"></div>
                    <span>Em Andamento ({metrics.emAndamento})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color pendente"></div>
                    <span>Pendentes ({metrics.pendentes})</span>
                  </div>
                </div>
                <div className="chart-visual">
                  <div 
                    className="chart-segment completa" 
                    style={{ 
                      '--percentage': `${metrics.total > 0 ? (metrics.completas / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                  <div 
                    className="chart-segment em-andamento" 
                    style={{ 
                      '--percentage': `${metrics.total > 0 ? (metrics.emAndamento / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                  <div 
                    className="chart-segment pendente" 
                    style={{ 
                      '--percentage': `${metrics.total > 0 ? (metrics.pendentes / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise por Prioridade */}
          <div className="priority-analysis">
            <h2>Análise por Prioridade</h2>
            <div className="priority-bars">
              <div className="priority-bar">
                <div className="priority-label">
                  <span>🔴 Alta Prioridade</span>
                  <span>{metrics.altaPrioridade}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill alta" 
                    style={{ 
                      width: `${metrics.total > 0 ? (metrics.altaPrioridade / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="priority-bar">
                <div className="priority-label">
                  <span>🟡 Média Prioridade</span>
                  <span>{metrics.mediaPrioridade}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill media" 
                    style={{ 
                      width: `${metrics.total > 0 ? (metrics.mediaPrioridade / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="priority-bar">
                <div className="priority-label">
                  <span>🟢 Baixa Prioridade</span>
                  <span>{metrics.baixaPrioridade}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill baixa" 
                    style={{ 
                      width: `${metrics.total > 0 ? (metrics.baixaPrioridade / metrics.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise Temporal */}
          <div className="temporal-analysis">
            <h2>Análise Temporal</h2>
            <div className="temporal-grid">
              <div className="temporal-card overdue">
                <h4>⚠️ Atrasadas</h4>
                <div className="temporal-number">{metrics.atrasadas}</div>
                <p>Tarefas com prazo vencido</p>
              </div>
              <div className="temporal-card today">
                <h4>📅 Hoje</h4>
                <div className="temporal-number">{metrics.vencemHoje}</div>
                <p>Vencem hoje</p>
              </div>
              <div className="temporal-card upcoming">
                <h4>📈 Próxima Semana</h4>
                <div className="temporal-number">{metrics.proximaSemana}</div>
                <p>Vencem nos próximos 7 dias</p>
              </div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="recommendations">
            <h2>Recomendações</h2>
            <div className="recommendation-list">
              {metrics.atrasadas > 0 && (
                <div className="recommendation warning">
                  <span className="rec-icon">⚠️</span>
                  <div>
                    <strong>Atenção às tarefas atrasadas!</strong>
                    <p>Você tem {metrics.atrasadas} tarefas com prazo vencido. Considere priorizá-las.</p>
                  </div>
                </div>
              )}
              
              {metrics.taxaConclusao < 50 && (
                <div className="recommendation info">
                  <span className="rec-icon">💡</span>
                  <div>
                    <strong>Melhore sua taxa de conclusão</strong>
                    <p>Sua taxa atual é {metrics.taxaConclusao}%. Tente focar em menos tarefas por vez.</p>
                  </div>
                </div>
              )}
              
              {metrics.vencemHoje > 0 && (
                <div className="recommendation success">
                  <span className="rec-icon">🎯</span>
                  <div>
                    <strong>Foco no dia de hoje</strong>
                    <p>Você tem {metrics.vencemHoje} tarefas para concluir hoje. Boa sorte!</p>
                  </div>
                </div>
              )}
              
              {metrics.taxaConclusao >= 80 && (
                <div className="recommendation success">
                  <span className="rec-icon">🏆</span>
                  <div>
                    <strong>Excelente desempenho!</strong>
                    <p>Taxa de conclusão de {metrics.taxaConclusao}%. Continue assim!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>Sem dados para análise</h3>
          <p>Nenhuma tarefa encontrada para gerar insights.</p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Erro ao carregar insights:</strong> {error}
        </div>
      )}
    </div>
  );
}
