import 'package:flutter/material.dart';
import '../database/app_database.dart';
import 'package:drift/drift.dart' as drift;

class EditarPage extends StatefulWidget {
  const EditarPage({super.key});

  @override
  State<EditarPage> createState() => _EditarPageState();
}

class _EditarPageState extends State<EditarPage> {
  final _formKey = GlobalKey<FormState>();

  // Controladores para os campos de texto
  final _nomeController = TextEditingController();
  final _cpfController = TextEditingController();
  final _telefoneController = TextEditingController();

  final db = AppDatabase();

  @override
  Widget build(BuildContext context) {
    // 1. Recupera o objeto Cliente enviado pela rota
    final cliente = ModalRoute.of(context)!.settings.arguments as Cliente;

    // 2. Preenche os campos com os dados atuais do cliente (se estiverem vazios)
    if (_nomeController.text.isEmpty) {
      _nomeController.text = cliente.nome;
      _cpfController.text = cliente.cpf;
      _telefoneController.text = cliente.telefone;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Editar Cliente')),
      body: SingleChildScrollView(
        // Garante que o teclado não atrapalhe
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.stretch, // Estica o botão na largura total
            children: [
              const Text(
                'Alterar Informações',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 15),

              // Campo Nome
              TextFormField(
                controller: _nomeController,
                decoration: const InputDecoration(
                  labelText: 'Nome',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) =>
                    (value == null || value.isEmpty) ? 'Informe o nome' : null,
              ),
              const SizedBox(height: 10),

              // Campo CPF
              TextFormField(
                controller: _cpfController,
                decoration: const InputDecoration(
                  labelText: 'CPF',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.badge),
                ),
                keyboardType: TextInputType.number,
                validator: (value) =>
                    (value == null || value.isEmpty) ? 'Informe o CPF' : null,
              ),
              const SizedBox(height: 10),

              // Campo Telefone
              TextFormField(
                controller: _telefoneController,
                decoration: const InputDecoration(
                  labelText: 'Telefone',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
                validator: (value) => (value == null || value.isEmpty)
                    ? 'Informe o telefone'
                    : null,
              ),

              const SizedBox(height: 25),

              // Botão de Salvar Alterações
              ElevatedButton.icon(
                icon: const Icon(Icons.check),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 15),
                  backgroundColor: Colors
                      .orange, // Cor laranja para combinar com o ícone de editar
                  foregroundColor: Colors.white,
                ),
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    // Cria o objeto com os novos dados, mantendo o MESMO ID
                    final atualizado = ClientesCompanion(
                      id: drift.Value(cliente.id),
                      nome: drift.Value(_nomeController.text),
                      cpf: drift.Value(_cpfController.text),
                      telefone: drift.Value(_telefoneController.text),
                    );

                    // Executa a atualização no banco de dados
                    await db.atualizarCliente(atualizado);

                    if (mounted) {
                      // Feedback visual e volta para a tela anterior
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Cliente atualizado com sucesso!'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      Navigator.pop(context);
                    }
                  }
                },
                label: const Text(
                  'SALVAR ALTERAÇÕES',
                  style: TextStyle(fontSize: 16),
                ),
              ),

              const SizedBox(height: 10),

              // Botão Cancelar
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'CANCELAR',
                  style: TextStyle(color: Colors.grey),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
