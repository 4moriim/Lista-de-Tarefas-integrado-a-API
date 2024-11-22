import { useState } from 'react';

function CriarTarefa({ listarTarefa }) {
    const [valor, setValor] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [error, setError] = useState(null); // Estado de erro

    const submit = async (evento) => {
        if (!valor.trim()) return; // Não faz nada caso o texto estiver vazio

        setCarregando(true); // Inicia o carregamento
        setError(null); // Limpa quaisquer mensagens de erro

        try {
            const resposta = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: valor, is_completed: false }),
            });

            if (!resposta.ok) throw new Error('Erro ao criar tarefa');

            const novaTarefa = await response.json();
            listarTarefa(novaTarefa); // Atualiza a lista de tarefas no App.js
            setValor(''); // Limpa o campo de input
        } catch (erro) {
            setError('Erro ao criar tarefa'); // Mostra o erro se houver
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




