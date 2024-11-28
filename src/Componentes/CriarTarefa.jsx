import { useState } from 'react';
import axios from 'axios';

function CriarTarefa({ setTarefas, setNotificacao }) {  // Passando as funções como props
    const [valor, setValor] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [error, setError] = useState(null); // Estado de erro

    const submit = async (evento) => {
        evento.preventDefault(); // Previne o comportamento padrão do formulário

        if (!valor.trim()) return; // Não faz nada caso o texto esteja vazio

        setCarregando(true); // Inicia o carregamento
        setError(null); // Limpa quaisquer mensagens de erro

        try {
            const resposta = await axios.post('http://localhost:3000/todos', {
                title: valor,
                is_completed: false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (resposta.status === 201) {
                setTarefas((prevTarefas) => [...prevTarefas, resposta.data]); // Atualiza a lista com a nova tarefa
                setNotificacao({ type: 'success', message: 'Tarefa criada com sucesso!' }); // Exibe notificação de sucesso
                setValor(''); // Limpa o campo de input
            } else {
                throw new Error('Erro ao criar tarefa');
            }
        } catch (erro) {
            setError(erro.message || 'Erro ao criar tarefa'); // Mostra o erro se houver
            setNotificacao({ type: 'error', message: erro.message || 'Erro ao criar tarefa.' }); // Exibe notificação de erro
        } finally {
            setCarregando(false); // Finaliza o carregamento
        }
    };

    return (
        <div className="criar-tarefa-form">
            <h2>Criar tarefa:</h2>
            <form onSubmit={submit}>
                <input
                    type="text"
                    placeholder="Digite a tarefa"
                    value={valor}
                    onChange={(evento) => setValor(evento.target.value)} // Atualiza o valor do input
                    disabled={carregando} // Desabilita o input enquanto está carregando
                    onKeyUp={(evento) => { 
                        if (evento.key === "Enter" && !carregando) { 
                            submit(evento); // Dispara o submit ao pressionar Enter
                        }
                    }}
                />
                <button type="submit" disabled={carregando}>
                    {carregando ? 'Criando...' : 'Criar tarefa'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default CriarTarefa;




