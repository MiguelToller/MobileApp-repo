import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

export default function AppTarefas() {
  // Estados para armazenar os valores dos campos
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [responsavel, setResponsavel] = useState('');

  // Estado para armazenar a lista de tarefas
  const [tarefas, setTarefas] = useState([]);
  
  // Estado auxiliar para gerar IDs únicos
  const [proximoId, setProximoId] = useState(1);

  // Estado para controlar se estamos editando uma tarefa (armazena o ID da tarefa)
  const [tarefaEditandoId, setTarefaEditandoId] = useState(null);

  // Estado para exibir mensagens de erro na tela
  const [erroMsg, setErroMsg] = useState('');

  // Função para limpar os campos do formulário
  function limparFormulario() {
    setTitulo('');
    setDescricao('');
    setDataVencimento('');
    setResponsavel('');
    setTarefaEditandoId(null);
    setErroMsg('');
  }

  // Função responsável por cadastrar ou atualizar a tarefa
  function salvarTarefa() {
    setErroMsg(''); // Limpa mensagens anteriores

    // 1. Verificação dos campos inválidos
    if (titulo.trim() === '') {
      setErroMsg('O título da tarefa é obrigatório.');
      return;
    }
    if (descricao.trim() === '') {
      setErroMsg('A descrição da tarefa é obrigatória.');
      return;
    }
    if (dataVencimento.trim() === '') {
      setErroMsg('A data de vencimento é obrigatória.');
      return;
    }
    if (responsavel.trim() === '') {
      setErroMsg('O responsável é obrigatório.');
      return;
    }

    // Se estivermos editando uma tarefa existente
    if (tarefaEditandoId !== null) {
      const listaAtualizada = tarefas.map(tarefa => {
        if (tarefa.id === tarefaEditandoId) {
          return {
            ...tarefa,
            titulo,
            descricao,
            dataVencimento,
            responsavel
          };
        }
        return tarefa;
      });
      
      setTarefas(listaAtualizada);
      // Removemos o Alert pois na web ele pode ser bloqueado pelo navegador
    } 
    // Se for uma nova tarefa
    else {
      const novaTarefa = {
        id: proximoId,
        titulo,
        descricao,
        dataVencimento,
        responsavel,
      };

      setTarefas([...tarefas, novaTarefa]);
      setProximoId(proximoId + 1);
      // Removemos o Alert pois na web ele pode ser bloqueado pelo navegador
    }
    
    // Limpa o formulário e sai do modo de edição
    limparFormulario();
  }

  // Função para carregar os dados de uma tarefa no formulário para edição
  function editarTarefa(tarefa) {
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao);
    setDataVencimento(tarefa.dataVencimento);
    setResponsavel(tarefa.responsavel);
    setTarefaEditandoId(tarefa.id);
  }

  // Função para excluir uma tarefa
  function excluirTarefa(id) {
    const listaAtualizada = tarefas.filter(tarefa => tarefa.id !== id);
    setTarefas(listaAtualizada);
    
    // Se estiver excluindo a tarefa que está sendo editada no momento, limpa o formulário
    if (tarefaEditandoId === id) {
      limparFormulario();
    }
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.tituloSistema}>Cadastro de Tarefas</Text>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitulo}>
          {tarefaEditandoId ? 'Editando Tarefa' : 'Nova Tarefa'}
        </Text>

        {/* Exibe a mensagem de erro se houver */}
        {erroMsg !== '' && (
          <Text style={styles.textoErro}>{erroMsg}</Text>
        )}

        <Text style={styles.label}>Título da Tarefa *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Fazer relatório"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Detalhes da atividade"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Data de Vencimento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 20/10/2023"
          value={dataVencimento}
          onChangeText={setDataVencimento}
        />

        <Text style={styles.label}>Responsável *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João da Silva"
          value={responsavel}
          onChangeText={setResponsavel}
        />

        <View style={styles.botoesFormContainer}>
          {tarefaEditandoId && (
            <TouchableOpacity 
              style={[styles.botao, styles.botaoCancelar]} 
              onPress={limparFormulario}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.botao, styles.botaoSalvar, tarefaEditandoId ? {flex: 1, marginLeft: 10} : {}]} 
            onPress={salvarTarefa}
          >
            <Text style={styles.textoBotao}>
              {tarefaEditandoId ? 'Atualizar' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Listagem */}
      <Text style={styles.subTitulo}>Tarefas Cadastradas</Text>
      
      <View style={styles.listaContainer}>
        {tarefas.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhuma tarefa cadastrada.</Text>
        ) : (
          tarefas.map(tarefa => (
            <View key={tarefa.id} style={styles.itemTarefa}>
              <View style={styles.infoTarefa}>
                <Text style={styles.tituloTarefa}>
                  {tarefa.id} - {tarefa.titulo}
                </Text>
                <Text style={styles.detalheTarefa}>
                  Descrição: {tarefa.descricao}
                </Text>
                <Text style={styles.detalheTarefa}>
                  Vencimento: {tarefa.dataVencimento}
                </Text>
                <Text style={styles.detalheTarefa}>
                  Responsável: {tarefa.responsavel}
                </Text>
              </View>

              <View style={styles.botoesAcaoContainer}>
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoEditar]}
                  onPress={() => editarTarefa(tarefa)}
                >
                  <Text style={styles.textoBotaoAcao}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.botaoAcao, styles.botaoExcluir]}
                  onPress={() => excluirTarefa(tarefa.id)}
                >
                  <Text style={styles.textoBotaoAcao}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  tituloSistema: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 25,
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  textoErro: {
    color: '#DC3545',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  botoesFormContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  botao: {
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#007BFF',
    flex: 1,
  },
  botaoCancelar: {
    backgroundColor: '#6C757D',
    flex: 1,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listaContainer: {
    flex: 1,
  },
  textoVazio: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  itemTarefa: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#007BFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTarefa: {
    marginBottom: 10,
  },
  tituloTarefa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  detalheTarefa: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  botoesAcaoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  botaoAcao: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  botaoEditar: {
    backgroundColor: '#FFC107', // Amarelo
  },
  botaoExcluir: {
    backgroundColor: '#DC3545', // Vermelho
  },
  textoBotaoAcao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
