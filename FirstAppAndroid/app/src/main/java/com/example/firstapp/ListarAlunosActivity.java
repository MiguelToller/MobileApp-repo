package com.example.firstapp;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.util.ArrayList;
import java.util.List;

public class ListarAlunosActivity extends AppCompatActivity {

    private ListView listView;
    private AlunoDao dao;
    private List<Aluno> alunos;
    private List<Aluno> alunosFiltrados = new ArrayList<>();
    private ArrayAdapter<Aluno> adaptador;
    private AlunoDaoRoom alunoDaoRoom;
    private EditText editPesquisa;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_listar_alunos);

        editPesquisa = findViewById(R.id.editPesquisa);

        listView = findViewById(R.id.lista_alunos);
        dao = new AlunoDao(this);

        alunos = dao.obterTodos();      // Todos os alunos
        alunosFiltrados.addAll(alunos); // Alunos filtrados

        adaptador = new ArrayAdapter<Aluno>(this, android.R.layout.simple_list_item_1, alunosFiltrados);
        listView.setAdapter(adaptador);

        //colocar dentro do método onCreate() do ListarAlunosActivity
        //registrar o menu de contexto (excluir e atualizar) na listview
        registerForContextMenu(listView);

        alunoDaoRoom = AppDatabase.getInstance(this).alunoDaoRoom();
    }

    public void voltarParaCadastro(View view) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    // METODO MENU_CONTEXTO PARA INFLAR O MENU QUANDO ITEM PRESSIONADO
    @Override
    public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
        /* Chama o método da superclasse (neste caso, o método onCreateContextMenu da classe pai).
        Isso é importante para garantir que qualquer comportamento padrão do método na superclasse
        (por exemplo, qualquer configuração padrão de menu que a superclasse realiza) seja executado antes
        de você adicionar suas próprias ações ao menu.
        */
        super.onCreateContextMenu(menu, v, menuInfo);

        // Cria um objeto MenuInflater, que é responsável por inflar (converter um arquivo XML de menu em um objeto Menu)
        // o menu de contexto a partir de um arquivo XML de menu que você criou anteriormente.
        MenuInflater i = getMenuInflater();

        /* O método inflate do MenuInflater é usado para inflar o menu de contexto.
        Aqui, você está especificando o recurso XML (R.menu.menu_contexto) que define as opções de menu
        que aparecerão quando um item da lista for pressionado.
         */
        i.inflate(R.menu.menu_contexto, menu); //Aqui coloca o nome do menu que havia sido configurado
    }

    public void excluir(MenuItem item) {

        // Obtém as informações do item selecionado no menu de contexto
        // (inclui a posição do item na lista)
        AdapterView.AdapterContextMenuInfo menuInfo =
                (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();

        // Recupera o aluno a ser excluído da lista filtrada
        final Aluno alunoExcluir = alunosFiltrados.get(menuInfo.position);

        // Cria o diálogo de confirmação
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle("Atenção") // Título do alerta
                .setMessage("Realmente deseja excluir o aluno?") // Mensagem de confirmação

                // Botão "NÃO" - apenas fecha o diálogo
                .setNegativeButton("NÃO", null)

                // Botão "SIM" - executa a exclusão
                .setPositiveButton("SIM", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                        // Remove o aluno da lista filtrada
                        alunosFiltrados.remove(alunoExcluir);

                        // Remove o aluno da lista principal
                        alunos.remove(alunoExcluir);

                        // Exclui o aluno do banco de dados
                        dao.excluir(alunoExcluir);

                        // Atualiza a ListView para refletir a exclusão
                        listView.invalidateViews();
                    }
                })

                .create(); // Cria a caixa de diálogo

        // Exibe o diálogo na tela
        dialog.show();
    }

    public void atualizar(MenuItem item) {

        // Obtém informações do item selecionado no menu de contexto
        AdapterView.AdapterContextMenuInfo menuInfo =
                (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();

        // Recupera o aluno selecionado na lista filtrada
        final Aluno alunoAtualizar = alunosFiltrados.get(menuInfo.position);

        // Cria a Intent para abrir a tela de cadastro (MainActivity)
        Intent intent = new Intent(this, MainActivity.class);

        // Envia o aluno para edição
        intent.putExtra("aluno", alunoAtualizar);

        // Inicia a Activity
        startActivity(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();

        alunosFiltrados.clear();

        // Recarrega todos os alunos do banco de dados
        alunos = dao.obterTodos();

        // Cria e define o adapter para a ListView
        ArrayAdapter<Aluno> adaptador = new ArrayAdapter<>(
                this,
                android.R.layout.simple_list_item_1,
                alunosFiltrados
        );

        listView.setAdapter(adaptador);
    }

    public void pesquisarAluno(View view) {
        // 1. Pega o texto do EditText corretamente através da variável 'editPesquisa'
        String textoBusca = editPesquisa.getText().toString();

        // 2. Chama o DAO e recebe a nova lista filtrada
        List<Aluno> busca = dao.obterAlunosPorNome(textoBusca);

        // 3. Limpa a lista que o adaptador está usando (alunosFiltrados)
        alunosFiltrados.clear();

        // 4. Adiciona os novos resultados
        alunosFiltrados.addAll(busca);

        // 5. Avisa o adaptador que os dados mudaram para ele atualizar a tela
        // Note que usei 'adaptador', que é o nome da sua variável global
        ((ArrayAdapter) listView.getAdapter()).notifyDataSetChanged();
    }

}