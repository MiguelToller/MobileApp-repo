import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Task } from '../types';

/**
 * Propriedades esperadas pelo componente TaskForm.
 */
interface TaskFormProps {
  /** Tarefa que será carregada nos inputs para edição. Se nulo ou undefined, o formulário será de criação. */
  tarefaInicial?: Task | null;
  /** Função chamada quando a tarefa é salva com sucesso após a validação. Recebe um objeto Task sem o ID. */
  onSalvar: (tarefa: Omit<Task, 'id'>) => void;
  /** Função chamada quando o usuário clica em Cancelar. */
  onCancelar: () => void;
}

/**
 * Componente que renderiza um formulário para criação e edição de tarefas.
 * Trata estados internos, validações e formatações de entrada.
 *
 * @param props As propriedades do componente, incluindo a tarefa inicial (para edição) e callbacks de salvar e cancelar.
 */
export default function TaskForm({
  tarefaInicial,
  onSalvar,
  onCancelar,
}: TaskFormProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    if (tarefaInicial) {
      setTitulo(tarefaInicial.titulo);
      setDescricao(tarefaInicial.descricao);
      setDataVencimento(tarefaInicial.dataVencimento);
      setResponsavel(tarefaInicial.responsavel);
    }
  }, [tarefaInicial]);

  /**
   * Formata a entrada de texto do campo de data de vencimento.
   * Adiciona as barras '/' automaticamente no formato DD/MM/AAAA.
   * 
   * @param text O texto digitado pelo usuário
   */
  const handleDateChange = (text: string) => {
    // Remove tudo que não for número
    let formattedText = text.replace(/\D/g, '');
    
    // Adiciona as barras automaticamente
    if (formattedText.length > 2) {
      formattedText = formattedText.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    
    // Limita a 10 caracteres
    setDataVencimento(formattedText.substring(0, 10));
  };

  /**
   * Função responsável por validar todos os campos do formulário antes de enviar.
   * Exibe mensagens de erro na tela se houver algum problema.
   * Se válido, aciona a propriedade `onSalvar` e envia os dados formatados.
   */
  const handleSalvar = () => {
    setErroMsg('');

    if (!titulo.trim()) {
      setErroMsg('O título da tarefa é obrigatório.');
      return;
    }
    if (!descricao.trim()) {
      setErroMsg('A descrição da tarefa é obrigatória.');
      return;
    }
    if (!dataVencimento.trim()) {
      setErroMsg('A data de vencimento é obrigatória.');
      return;
    }

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dataVencimento)) {
      setErroMsg('Formato de data inválido. Use DD/MM/AAAA.');
      return;
    }
    if (!responsavel.trim()) {
      setErroMsg('O responsável é obrigatório.');
      return;
    }

    onSalvar({
      titulo,
      descricao,
      dataVencimento,
      responsavel,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {tarefaInicial ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <Text style={styles.subtitle}>
            Preencha os dados abaixo para organizar seu fluxo de trabalho.
          </Text>
        </View>

        {erroMsg !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{erroMsg}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>TÍTULO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Refatorar UI/UX"
            placeholderTextColor="#888"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Implementar design premium"
            placeholderTextColor="#888"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>DATA DE VENCIMENTO</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#888"
            value={dataVencimento}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>RESPONSÁVEL</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Miguel"
            placeholderTextColor="#888"
            value={responsavel}
            onChangeText={setResponsavel}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancelar}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>
              {tarefaInicial ? 'Salvar Edição' : 'Criar Tarefa'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(245, 101, 101, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#F56565',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#F56565',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0AEC0',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#1A202C',
    borderWidth: 1,
    borderColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3182CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
