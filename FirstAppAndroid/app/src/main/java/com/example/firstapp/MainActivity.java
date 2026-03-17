package com.example.firstapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private EditText nome;
    private EditText cpf;
    private EditText telefone;
    private EditText endereco;
    private EditText curso;
    private AlunoDao dao;
    private Aluno aluno = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        nome = findViewById(R.id.editNome);
        cpf = findViewById(R.id.editCPF);
        telefone = findViewById(R.id.editTelefone);
        endereco = findViewById(R.id.editEndereco);
        curso = findViewById(R.id.editCurso);

        dao = new AlunoDao(this);

        Intent intent = getIntent(); // Obtém a intenção que iniciou a Activity

        if (intent.hasExtra("aluno")) {

            // Recupera o objeto aluno enviado pela Intent
            aluno = (Aluno) intent.getSerializableExtra("aluno");

            // Preenche os campos com os dados do aluno
            nome.setText(aluno.getNome() != null ? aluno.getNome() : "");
            cpf.setText(aluno.getCpf() != null ? aluno.getCpf() : "");
            telefone.setText(aluno.getTelefone() != null ? aluno.getTelefone() : "");
            endereco.setText(aluno.getEndereco() != null ? aluno.getEndereco() : "");
            curso.setText(aluno.getCurso() != null ? aluno.getCurso() : "");
        }
    }

    //----------------------------//método para botão salvar qdo clicado---------------------------------------------------------//
    public void salvar(View view){
        String nomeDigitado = nome.getText().toString().trim();
        String cpfDigitado = cpf.getText().toString().trim();
        String telefoneDigitado = telefone.getText().toString().trim();
        String enderecoDigitado = endereco.getText().toString().trim();
        String cursoDigitado = endereco.getText().toString().trim();

        // Verifica se os campos estão vazios
        if (nomeDigitado.isEmpty() || cpfDigitado.isEmpty() || telefoneDigitado.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos!", Toast.LENGTH_SHORT).show();
            return;
        }


        // aluno ==null cadastrar, aluno!=null esta recebendo do ListarAlunos
        if (aluno == null) {
            // Criar objeto Aluno
            Aluno aluno = new Aluno();
            aluno.setNome(nomeDigitado);
            aluno.setCpf(cpfDigitado);
            aluno.setTelefone(telefoneDigitado);
            aluno.setEndereco(enderecoDigitado);
            aluno.setCurso(cursoDigitado);
            // Inserir aluno no banco de dados
            long id = dao.inserir(aluno);
            if (id != -1) {
                Toast.makeText(this, "Aluno inserido com id: " + id, Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Erro ao inserir aluno. Tente novamente.", Toast.LENGTH_SHORT).show();
            }
        }
        else{
            // Atualização de um aluno existente
            aluno.setNome(nomeDigitado);
            aluno.setCpf(cpfDigitado);
            aluno.setTelefone(telefoneDigitado);
            aluno.setEndereco(enderecoDigitado);
            aluno.setCurso(cursoDigitado);
            dao.atualizar(aluno);
            Toast.makeText(this, "Aluno atualizado com sucesso!", Toast.LENGTH_SHORT).show();
        }
        // Fecha a tela de cadastro e volta para a listagem
        //finish();
    }


    public void irParaListar(View view) {
        Intent intent = new Intent(this, ListarAlunosActivity.class);
        startActivity(intent);
    }

}