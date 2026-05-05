import 'package:flutter/material.dart';

class PrimeiraTela extends StatelessWidget {
  const PrimeiraTela({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Menu Principal'),
        backgroundColor: Colors.blue.shade100,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment
                .stretch, // Faz os botões ocuparem a mesma largura
            children: [
              const Icon(
                Icons.account_tree_outlined,
                size: 80,
                color: Colors.blue,
              ),
              const SizedBox(height: 30),

              // Botão para Tela de Cadastro
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/cadastro');
                },
                icon: const Icon(Icons.person_add),
                label: const Text('Cadastrar Novo Cliente'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.all(15),
                ),
              ),

              const SizedBox(height: 15),

              // Botão para Tela de Listagem
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/listar');
                },
                icon: const Icon(Icons.list),
                label: const Text('Ver Lista de Clientes'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.all(15),
                ),
              ),

              const SizedBox(height: 15),

              // Botão para a antiga Tela 02
              OutlinedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/segunda');
                },
                icon: const Icon(Icons.arrow_forward),
                label: const Text('Ir para Tela 02 (Exemplo)'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.all(15),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
