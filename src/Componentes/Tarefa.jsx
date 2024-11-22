import React, { useState } from "react";

const Tarefa = ({ tarefa, excluirTarefa, concluirTarefa, editarTarefa }) => {
  const [estaEditando, setEstaEditando] = useState(false);
  const [novoTexto, setNovoTexto] = useState(tarefa.title);
  const [carregando, setCarregando] = useState(false);

  const salvarEdicao = async () => {
    if (!novoTexto.trim()) return; // Não faz nada caso o texto estiver vazio

    setCarregando(true);

    try {
      await editarTarefa(tarefa.id, novoTexto); // Usa a função de editar tarefa
      setEstaEditando(false); // Fecha o modo de edição
    } catch (erro) {
      console.error('Erro ao editar tarefa:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const alternarConclusao = async () => {
    setCarregando(true);

    try {
      await concluirTarefa(tarefa.id); // Atualiza o status de conclusão
    } catch (erro) {
      console.error('Erro ao concluir tarefa:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const deletarTarefa = async () => {
    setCarregando(true);

    try {
      await excluirTarefa(tarefa.id);
    } catch (erro) {
      console.error('Erro ao excluir tarefa:', erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="tarefa">
      <div
        className="conteudo"
        style={{
          textDecoration: tarefa.is_completed ? "line-through" : "",
        }}
      >
        {estaEditando ? (
          <input
            type="text"
            value={novoTexto}
            onChange={(evento) => setNovoTexto(evento.target.value)}
            disabled={carregando}
          />
        ) : (
          <p>{tarefa.title}</p>
        )}
      </div>
      <div className="botoes">
        {estaEditando ? (
          <>
            <button className="salvar" onClick={salvarEdicao} disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar"}
            </button>
            <button
              className="cancelar"
              onClick={() => setEstaEditando(false)}
              disabled={carregando}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="completar"
              onClick={alternarConclusao}
              disabled={carregando}
            >
              {tarefa.is_completed ? "Retornar" : "Completar"}
            </button>
            <button className="remover" onClick={deletarTarefa} disabled={carregando}>
              Excluir
            </button>
            <button
              className="editar"
              onClick={() => setEstaEditando(true)}
              disabled={carregando}
            >
              Editar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Tarefa;



