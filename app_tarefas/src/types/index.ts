/**
 * Representa uma tarefa dentro do sistema.
 */
export interface Task {
  /** Identificador único da tarefa. */
  id: number;
  /** Título ou nome resumido da tarefa. */
  titulo: string;
  /** Descrição detalhada do que precisa ser feito. */
  descricao: string;
  /** Data limite para a conclusão da tarefa no formato DD/MM/AAAA. */
  dataVencimento: string;
  /** Nome da pessoa encarregada de realizar a tarefa. */
  responsavel: string;
}
