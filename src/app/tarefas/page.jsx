'use client';

import { useState, useEffect } from 'react';
import styles from './tarefas.module.css';

export default function Tarefas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas'); // todas, pendente, em-andamento, completa
  const [showModal, setShowModal] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({
    title: '',
    description: '',
    priority: 'media',
    due_date: ''
  });

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
            description: "Revisar conceitos de async/await e promises",
            status: "em-andamento",
            priority: "alta",
            due_date: "2025-09-10",
            created_at: "2025-09-08T10:00:00Z"
          },
          {
            id: 2,
            title: "Ler documentação React",
            description: "Estudar hooks avançados e context API",
            status: "pendente",
            priority: "media",
            due_date: "2025-09-12",
            created_at: "2025-09-07T14:30:00Z"
          },
          {
            id: 3,
            title: "Projeto final",
            description: "Finalizar sistema Kairos com todas as funcionalidades",
            status: "completa",
            priority: "alta",
            due_date: "2025-09-09",
            created_at: "2025-09-05T09:00:00Z"
          },
          {
            id: 4,
            title: "Estudar CSS Grid",
            description: "Praticar layouts responsivos com Grid",
            status: "pendente",
            priority: "baixa",
            due_date: "2025-09-15",
            created_at: "2025-09-08T16:00:00Z"
          },
          {
            id: 5,
            title: "Revisar algoritmos",
            description: "Estudar estruturas de dados básicas",
            status: "pendente",
            priority: "media",
            due_date: "2025-09-08", // Atrasada
            created_at: "2025-09-06T11:00:00Z"
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

  // Função para adicionar nova tarefa
  const adicionarTarefa = () => {
    if (!novaTarefa.title.trim()) return;

    const novaTask = {
      id: Date.now(), // ID temporário
      title: novaTarefa.title,
      description: novaTarefa.description,
      status: 'pendente',
      priority: novaTarefa.priority,
      due_date: novaTarefa.due_date,
      created_at: new Date().toISOString()
    };

    // Atualizar dados localmente
    if (data?.data?.tasks?.all) {
      const dadosAtualizados = {
        ...data,
        data: {
          ...data.data,
          tasks: {
            ...data.data.tasks,
            all: [...data.data.tasks.all, novaTask]
          }
        }
      };
      setData(dadosAtualizados);
    }

    // Resetar formulário e fechar modal
    setNovaTarefa({
      title: '',
      description: '',
      priority: 'media',
      due_date: ''
    });
    setShowModal(false);
  };

  // Função para alterar status da tarefa
  const alterarStatusTarefa = (taskId, novoStatus) => {
    if (data?.data?.tasks?.all) {
      const dadosAtualizados = {
        ...data,
        data: {
          ...data.data,
          tasks: {
            ...data.data.tasks,
            all: data.data.tasks.all.map(task =>
              task.id === taskId ? { ...task, status: novoStatus } : task
            )
          }
        }
      };
      setData(dadosAtualizados);
    }
  };

  // Função para remover tarefa
  const removerTarefa = (taskId) => {
    if (confirm('Tem certeza que deseja remover esta tarefa? Esta ação não pode ser desfeita.')) {
      if (data?.data?.tasks?.all) {
        const dadosAtualizados = {
          ...data,
          data: {
            ...data.data,
            tasks: {
              ...data.data.tasks,
              all: data.data.tasks.all.filter(task => task.id !== taskId)
            }
          }
        };
        setData(dadosAtualizados);
      }
    }
  };

  // Filtrar tarefas baseado no filtro selecionado
  const getTarefasFiltradas = () => {
    if (!data?.data?.tasks?.all) return [];
    
    const tasks = data.data.tasks.all;
    
    if (filtro === 'todas') return tasks;
    return tasks.filter(task => task.status === filtro);
  };

  // Ordenar tarefas por prioridade e prazo
  const getTarefasOrdenadas = () => {
    const tarefas = getTarefasFiltradas();
    
    return [...tarefas].sort((a, b) => {
      // Primeiro por prioridade (alta > media > baixa)
      const prioridadeOrder = { 'alta': 3, 'media': 2, 'baixa': 1 };
      const prioA = prioridadeOrder[a.priority] || 0;
      const prioB = prioridadeOrder[b.priority] || 0;
      
      if (prioA !== prioB) return prioB - prioA;
      
      // Depois por prazo (mais próximo primeiro)
      return new Date(a.due_date) - new Date(b.due_date);
    });
  };

  const tarefasOrdenadas = getTarefasOrdenadas();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header da página */}
      <div className="page-header">
        <h1>Tarefas</h1>
        <p>Lista de tarefas de estudo - criar, editar, concluir e priorizar</p>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ Adicionar Tarefa
          </button>
          <button className="btn" onClick={fetchKairosData} disabled={loading}>
            {loading ? 'Atualizando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h3>Filtrar por Status</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas ({data?.data?.tasks?.all?.length || 0})
          </button>
          <button 
            className={`filter-btn ${filtro === 'pendente' ? 'active' : ''}`}
            onClick={() => setFiltro('pendente')}
          >
            Pendentes ({data?.data?.tasks?.all?.filter(t => t.status === 'pendente').length || 0})
          </button>
          <button 
            className={`filter-btn ${filtro === 'em-andamento' ? 'active' : ''}`}
            onClick={() => setFiltro('em-andamento')}
          >
            Em Andamento ({data?.data?.tasks?.all?.filter(t => t.status === 'em-andamento').length || 0})
          </button>
          <button 
            className={`filter-btn ${filtro === 'completa' ? 'active' : ''}`}
            onClick={() => setFiltro('completa')}
          >
            Concluídas ({data?.data?.tasks?.all?.filter(t => t.status === 'completa').length || 0})
          </button>
        </div>
      </div>

      {/* Lista de Tarefas */}
      {tarefasOrdenadas.length > 0 ? (
        <div className="tasks-container fade-in">
          <div className="tasks-header">
            <h2>
              {filtro === 'todas' ? 'Todas as Tarefas' : `Tarefas ${filtro.charAt(0).toUpperCase() + filtro.slice(1).replace('-', ' ')}`} 
              ({tarefasOrdenadas.length})
            </h2>
          </div>
          
          {tarefasOrdenadas.map((task, index) => {
            const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completa';
            const isToday = new Date(task.due_date).toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={task.id || index} 
                className={`task-item ${isOverdue ? 'overdue' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="task-header">
                  <h3 className="task-title">
                    {task.title}
                    {isOverdue && <span className="overdue-badge">Atrasada</span>}
                    {isToday && !isOverdue && <span className="today-badge">Hoje</span>}
                  </h3>
                  <div className="task-badges">
                    <span className={`task-status ${task.status}`}>
                      {task.status}
                    </span>
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-meta">
                  <div className="task-meta-item">
                    <span>Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="task-meta-item">
                    <span>Criado: {new Date(task.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="task-meta-item">
                    <span>ID: {task.id}</span>
                  </div>
                </div>

                {/* Botões de ação para alterar status */}
                <div className={styles.taskActions}>
                  <div className={styles.statusButtons}>
                    <button 
                      className={`${styles.actionBtn} ${task.status === 'pendente' ? styles.active : ''}`}
                      onClick={() => alterarStatusTarefa(task.id, 'pendente')}
                      title="Marcar como Pendente"
                    >
                      Pendente
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${task.status === 'em-andamento' ? styles.active : ''}`}
                      onClick={() => alterarStatusTarefa(task.id, 'em-andamento')}
                      title="Marcar como Em Andamento"
                    >
                      Em Andamento
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${task.status === 'completa' ? styles.active : ''}`}
                      onClick={() => alterarStatusTarefa(task.id, 'completa')}
                      title="Marcar como Concluída"
                    >
                      Concluída
                    </button>
                  </div>
                  
                  <button 
                    className={`${styles.actionBtn} ${styles.removeBtn}`}
                    onClick={() => removerTarefa(task.id)}
                    title="Remover Tarefa"
                  >
                    Remover Tarefa
                  </button>
                </div>

                {/* Progresso visual para tarefas em andamento */}
                {task.status === 'em-andamento' && (
                  <div className="task-progress">
                    <div className="progress-bar small">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <small>Em progresso...</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3>
            {filtro === 'todas' 
              ? 'Nenhuma tarefa encontrada' 
              : `Nenhuma tarefa ${filtro} encontrada`
            }
          </h3>
          <p>
            {filtro === 'todas' 
              ? 'O sistema não retornou tarefas para exibir.'
              : `Não há tarefas com status "${filtro}" no momento.`
            }
          </p>
        </div>
      )}

      {/* Resumo das tarefas */}
      {data?.data?.tasks?.all && (
        <div className="tasks-summary">
          <h3>Resumo das Tarefas</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total:</span>
              <span className="summary-value">{data.data.tasks.all.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pendentes:</span>
              <span className="summary-value">{data.data.tasks.all.filter(t => t.status === 'pendente').length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Em Andamento:</span>
              <span className="summary-value">{data.data.tasks.all.filter(t => t.status === 'em-andamento').length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Concluídas:</span>
              <span className="summary-value">{data.data.tasks.all.filter(t => t.status === 'completa').length}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Erro ao carregar tarefas:</strong> {error}
        </div>
      )}

      {/* Modal para adicionar tarefa */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Adicionar Nova Tarefa</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Nome da Tarefa *</label>
                <input
                  type="text"
                  id="title"
                  value={novaTarefa.title}
                  onChange={(e) => setNovaTarefa({...novaTarefa, title: e.target.value})}
                  placeholder="Ex: Estudar React Hooks"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  value={novaTarefa.description}
                  onChange={(e) => setNovaTarefa({...novaTarefa, description: e.target.value})}
                  placeholder="Descrição detalhada da tarefa..."
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="priority">Prioridade</label>
                  <select
                    id="priority"
                    value={novaTarefa.priority}
                    onChange={(e) => setNovaTarefa({...novaTarefa, priority: e.target.value})}
                  >
                    <option value="baixa">🟢 Baixa</option>
                    <option value="media">🟡 Média</option>
                    <option value="alta">🔴 Alta</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="due_date">Prazo</label>
                  <input
                    type="date"
                    id="due_date"
                    value={novaTarefa.due_date}
                    onChange={(e) => setNovaTarefa({...novaTarefa, due_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={`btn ${styles.btnSecondary}`}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`btn ${styles.btnPrimary}`}
                onClick={adicionarTarefa}
                disabled={!novaTarefa.title.trim()}
              >
                ➕ Adicionar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}