import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Task } from '../types';

/**
 * Propriedades esperadas pelo componente TaskCard.
 */
interface TaskCardProps {
  /** A tarefa que será exibida no cartão. */
  tarefa: Task;
  /** Função callback disparada ao clicar no botão "Editar". */
  onEditar: (tarefa: Task) => void;
  /** Função callback disparada ao clicar no botão "Excluir". */
  onExcluir: (id: number) => void;
}

/**
 * Componente responsável por renderizar um único cartão de tarefa na lista.
 * Utiliza o `react-native-reanimated` para animar a entrada e saída do cartão.
 *
 * @param props As propriedades do componente, incluindo os dados da tarefa e os callbacks de ação.
 */
export default function TaskCard({ tarefa, onEditar, onExcluir }: TaskCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      exiting={FadeOutDown.duration(300)}
      style={styles.card}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {tarefa.titulo}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>#{tarefa.id}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {tarefa.descricao}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vencimento</Text>
            <Text style={styles.infoValue}>{tarefa.dataVencimento}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Responsável</Text>
            <Text style={styles.infoValue}>{tarefa.responsavel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEditar(tarefa)}
        >
          <Text style={[styles.actionText, styles.textEdit]}>Editar</Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onExcluir(tarefa.id)}
        >
          <Text style={[styles.actionText, styles.textDelete]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#718096',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  actionsBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    backgroundColor: '#141821',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#2D3748',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textEdit: {
    color: '#3182CE',
  },
  textDelete: {
    color: '#F56565',
  },
});
