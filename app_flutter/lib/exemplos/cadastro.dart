import 'package:flutter/material.dart';
import 'package:app_flutter/exemplos/listar.dart';

class CadastroClientePage extends StatefulWidget {
  const CadastroClientePage({super.key});

  @override
  State<CadastroClientePage> createState() => _CadastroClientePageState();
}

class _CadastroClientePageState extends State<CadastroClientePage> {
  final _formKey = GlobalKey<FormState>();
  String nome = '';
  String cpf = '';
  String telefone = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cadastro de Cliente'),
        // O Flutter adiciona o botão "voltar" automaticamente aqui
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Nome Completo',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.person),
                  ),
                  textInputAction:
                      TextInputAction.next, // Pula para o próximo campo
                  validator: (value) => (value == null || value.isEmpty)
                      ? 'Informe o nome'
                      : null,
                  onSaved: (value) => nome = value!,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'CPF',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.badge),
                  ),
                  keyboardType: TextInputType.number,
                  textInputAction: TextInputAction.next,
                  validator: (value) =>
                      (value == null || value.isEmpty) ? 'Informe o CPF' : null,
                  onSaved: (value) => cpf = value!,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Telefone',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.phone),
                  ),
                  keyboardType: TextInputType.phone,
                  textInputAction: TextInputAction.done, // Finaliza o teclado
                  validator: (value) => (value == null || value.isEmpty)
                      ? 'Informe o telefone'
                      : null,
                  onSaved: (value) => telefone = value!,
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 15),
                  ),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      _formKey.currentState!.save();

                      // Esconde o teclado
                      FocusScope.of(context).unfocus();

                      // Adiciona à lista global
                      listaClientes.add(
                        Cliente(nome: nome, cpf: cpf, telefone: telefone),
                      );

                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Cliente $nome cadastrado!')),
                      );

                      _formKey.currentState!.reset();
                    }
                  },
                  child: const Text('SALVAR CLIENTE'),
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/listar');
                  },
                  child: const Text('Visualizar Lista de Clientes'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
