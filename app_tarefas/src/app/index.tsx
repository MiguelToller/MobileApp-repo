import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

/**
 * Tela principal do aplicativo de Tarefas.
 * Gerencia a lista de tarefas cadastradas, exibindo-as em uma ScrollView e 
 * controlando a abertura do Modal que contém o formulário (TaskForm).
 */
export default function AppTarefas() {
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [proximoId, setProximoId] = useState(1);

  // Controle do Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Task | null>(null);

  // Ações do formulário

  /**
   * Função executada quando o usuário salva o formulário.
   * Cria uma nova tarefa se não estiver em modo de edição ou atualiza a tarefa existente.
   * 
   * @param novaTarefaData Os dados validados da tarefa vindos do formulário.
   */
  function handleSalvarTarefa(novaTarefaData: Omit<Task, 'id'>) {
    if (tarefaEditando) {
      const listaAtualizada = tarefas.map(t =>
        t.id === tarefaEditando.id ? { ...t, ...novaTarefaData } : t
      );
      setTarefas(listaAtualizada);
    } else {
      const novaTarefa: Task = {
        id: proximoId,
        ...novaTarefaData,
      };
      setTarefas([novaTarefa, ...tarefas]); // Adiciona no início da lista
      setProximoId(proximoId + 1);
    }
    fecharModal();
  }

  /**
   * Prepara o Modal para o modo de edição, carregando a tarefa selecionada.
   * 
   * @param tarefa A tarefa que será editada.
   */
  function handleEditarTarefa(tarefa: Task) {
    setTarefaEditando(tarefa);
    setModalVisivel(true);
  }

  /**
   * Remove uma tarefa da lista pelo seu ID.
   * 
   * @param id O identificador único da tarefa a ser excluída.
   */
  function handleExcluirTarefa(id: number) {
    const listaAtualizada = tarefas.filter(tarefa => tarefa.id !== id);
    setTarefas(listaAtualizada);
  }

  /**
   * Abre o Modal no modo de criação (limpa o estado de edição anterior, se existir).
   */
  function abrirModalNovaTarefa() {
    setTarefaEditando(null);
    setModalVisivel(true);
  }

  /**
   * Fecha o Modal e reseta o modo de edição.
   */
  function fecharModal() {
    setModalVisivel(false);
    setTarefaEditando(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Tarefas</Text>
        <Text style={styles.headerSubtitle}>
          {tarefas.length} {tarefas.length === 1 ? 'tarefa' : 'tarefas'} cadastrada(s)
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {tarefas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyTitle}>Tudo limpo por aqui!</Text>
            <Text style={styles.emptySubtitle}>
              Adicione uma nova tarefa clicando no botão abaixo.
            </Text>
          </View>
        ) : (
          tarefas.map(tarefa => (
            <TaskCard
              key={tarefa.id}
              tarefa={tarefa}
              onEditar={handleEditarTarefa}
              onExcluir={handleExcluirTarefa}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={abrirModalNovaTarefa}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal do Formulário */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <TaskForm
            tarefaInicial={tarefaEditando}
            onSalvar={handleSalvarTarefa}
            onCancelar={fecharModal}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D1117', // Dark background premium
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#0D1117',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Espaço para o FAB
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3182CE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
});
