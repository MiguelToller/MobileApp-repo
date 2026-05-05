import 'package:flutter/material.dart';
import '../database/app_database.dart';

// Mudamos para StatefulWidget para que a tela consiga se "rebuildar" após uma exclusão ou edição
class ListarPage extends StatefulWidget {
  const ListarPage({super.key});

  @override
  State<ListarPage> createState() => _ListarPageState();
}

class _ListarPageState extends State<ListarPage> {
  final db = AppDatabase();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lista de Clientes'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<List<Cliente>>(
        future: db.listarClientes(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(child: Text('Erro ao carregar dados!'));
          }

          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final clientes = snapshot.data!;

          if (clientes.isEmpty) {
            return const Center(child: Text('Nenhum cliente cadastrado.'));
          }

          return ListView.builder(
            itemCount: clientes.length,
            itemBuilder: (context, index) {
              final cliente = clientes[index];

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text(cliente.nome[0].toUpperCase()),
                  ),
                  title: Text(
                    cliente.nome,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    'CPF: ${cliente.cpf}\nTel: ${cliente.telefone}',
                  ),
                  isThreeLine: true,
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Botão Editar - Agora funcional!
                      IconButton(
                        icon: const Icon(Icons.edit, color: Colors.orange),
                        onPressed: () async {
                          // Navega para a tela de edição enviando o cliente como argumento
                          await Navigator.pushNamed(
                            context,
                            '/atualizar',
                            arguments: cliente,
                          );
                          // Atualiza a lista quando retornar da tela de edição
                          setState(() {});
                        },
                      ),
                      // Botão Excluir
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Excluir Cliente'),
                              content: Text(
                                'Deseja realmente excluir ${cliente.nome}?',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Cancelar'),
                                ),
                                TextButton(
                                  onPressed: () async {
                                    // 1. Deleta do banco de dados
                                    await db.excluirCliente(cliente.id);

                                    // 2. Fecha o alerta
                                    if (context.mounted) Navigator.pop(context);

                                    // 3. Atualiza a tela
                                    setState(() {});

                                    if (context.mounted) {
                                      ScaffoldMessenger.of(
                                        context,
                                      ).showSnackBar(
                                        const SnackBar(
                                          content: Text('Cliente removido!'),
                                        ),
                                      );
                                    }
                                  },
                                  child: const Text(
                                    'Excluir',
                                    style: TextStyle(color: Colors.red),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
