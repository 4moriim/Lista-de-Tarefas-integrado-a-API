import { useState, useEffect } from 'react';
import Tarefa from './Componentes/Tarefa';
import CriarTarefa from './Componentes/CriarTarefa';
import api from './API'; // Importa a API para fazer requisições
import './App.css';

function App() {
  // Aqui são declarados os estados para armazenar tarefas, carregamento, erro e notificações
  const [tarefas, setTarefas] = useState([]); // Lista de tarefas
  const [carregando, setCarregando] = useState(false); // Indicador de carregamento
  const [erro, setErro] = useState(null); // Mensagem de erro
  const [notificacao, setNotificacao] = useState(null); // Notificação de sucesso ou erro

  // Carrega as tarefas quando o componente é montado
  useEffect(() => {
    const fetchTarefas = async () => {
      setCarregando(true); // Inicia o carregamento
      try {
        const resposta = await api.get('/todos'); // Fazendo a requisição para a API
        setTarefas(resposta.data); // Atualiza-se com as tarefas recebidas
      } catch (error) {
        setErro('Erro ao buscar tarefas.'); // Caso haja erro, atualiza o estado de erro
      } finally {
        setCarregando(false); // Finaliza o carregamento
      }
    };
    fetchTarefas(); // Executa a função para buscar as tarefas
  }, []);

  // Função que exclui uma tarefa
  const excluirTarefa = async (id) => {
    setCarregando(true);
    setErro(null); // Reseta qualquer erro anterior
    try {
      await api.delete(`/todos/${id}`); // Faz a requisição para a API
      setTarefas((prevTarefas) => prevTarefas.filter((tarefa) => tarefa.id !== id)); // Atualiza a lista removendo a tarefa apagada
      setNotificacao({ type: 'success', message: 'Tarefa excluída com sucesso!' }); // Exibe notificação de sucesso
    } catch (error) {
      setErro('Erro ao excluir tarefa.'); // Exibe mensagem de erro
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  // Função para concluir/reverter o status da tarefa
  const concluirTarefa = async (id) => {
    setCarregando(true);
    setErro(null); // Reseta qualquer erro anterior
    try {
      const tarefa = tarefas.find((tarefa) => tarefa.id === id); // Encontra a tarefa pelo ID
      const tarefaAtualizada = { ...tarefa, is_completed: !tarefa.is_completed }; // Inverte o estado de conclusão
      await api.put(`/todos/${id}`, tarefaAtualizada); // Faz a requisição para a API
      setTarefas((prevTarefas) =>
        prevTarefas.map((t) => (t.id === id ? tarefaAtualizada : t)) // Atualiza a lista de tarefas com a tarefa modificada
      );
      setNotificacao({
        type: 'success',
        message: tarefa.is_completed ? 'Tarefa marcada como pendente.' : 'Tarefa concluída com sucesso!',
      }); // Exibe a notificação de sucesso
    } catch (error) {
      setErro('Erro ao atualizar tarefa.'); // Exibe mensagem de erro
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  // Função que edita o título de uma tarefa
  const editarTarefa = async (id, novoTexto) => {
    setCarregando(true);
    setErro(null); // Reseta qualquer erro anterior
    try {
      const tarefa = tarefas.find((tarefa) => tarefa.id === id); // Encontra a tarefa pelo ID
      const tarefaAtualizada = { ...tarefa, title: novoTexto }; // Cria uma cópia da tarefa com o novo título
      await api.put(`/todos/${id}`, tarefaAtualizada); // Faz a requisição para a API
      setTarefas((prevTarefas) =>
        prevTarefas.map((t) => (t.id === id ? tarefaAtualizada : t)) // Atualiza a lista de tarefas com a tarefa editada
      );
      setNotificacao({ type: 'success', message: 'Tarefa editada com sucesso!' }); // Exibe notificação de sucesso
    } catch (error) {
      setErro('Erro ao editar tarefa.'); // Exibe mensagem de erro
    } finally {
      setCarregando(false); // Finaliza o carregamento
    }
  };

  // Função que atualiza o estado de uma tarefa
  const atualizarTarefa = (tarefasAtualizadas) => {
    setTarefas(tarefas.map((tarefa) =>
      tarefa.id === tarefasAtualizadas.id ? tarefasAtualizadas : tarefa // Atualiza a tarefa no estado
    ));
  };

  // Filtra as tarefas pendentes e concluídas
  const tarefasPendentes = tarefas.filter((tarefa) => !tarefa.is_completed); // Filtra tarefas pendentes
  const tarefasConcluidas = tarefas.filter((tarefa) => tarefa.is_completed); // Filtra tarefas concluídas

  // Remove a notificação depois de 5 segundos
  useEffect(() => {
    if (notificacao) {
      const timer = setTimeout(() => setNotificacao(null), 5000); // Remove a notificação depois 5 segundos
      return () => clearTimeout(timer); // Limpa o timer quando o componente for desmontado
    }
  }, [notificacao]); // Executa esse efeito sempre que a notificação mudar

  return (
    <div className="app">
      <h1>Lista de Tarefas</h1>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="error">{erro}</p>}
      {notificacao && (
        <div className={`notification ${notificacao.type}`}>
          {notificacao.message}
        </div>
      )}

      <div className="lista-tarefas-container">
        <div className="lista-tarefas">
          <h2>Tarefas Pendentes</h2>
          {tarefasPendentes.length === 0 ? (
            <p>Não há tarefas pendentes.</p>
          ) : (
            tarefasPendentes.map((tarefa) => (
              <Tarefa
                key={tarefa.id}
                tarefa={tarefa}
                excluirTarefa={excluirTarefa}
                concluirTarefa={concluirTarefa}
                editarTarefa={editarTarefa}
                atualizarTarefa={atualizarTarefa}
              />
            ))
          )}
        </div>

        {tarefasConcluidas.length > 0 && (
          <div className="lista-tarefas">
            <h2>Tarefas Concluídas</h2>
            {tarefasConcluidas.map((tarefa) => (
              <Tarefa
                key={tarefa.id}
                tarefa={tarefa}
                excluirTarefa={excluirTarefa}
                concluirTarefa={concluirTarefa}
                editarTarefa={editarTarefa}
                atualizarTarefa={atualizarTarefa}
              />
            ))}
          </div>
        )}
      </div>

      <CriarTarefa setTarefas={setTarefas} setNotificacao={setNotificacao} />
    </div>
  );
}

export default App;
