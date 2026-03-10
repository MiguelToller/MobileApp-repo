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
    }

    public void salvar(View view) {

        // Pega o texto e remove espaços
        String sNome = nome.getText().toString().trim();
        String sCpf = cpf.getText().toString().trim();
        String sTelefone = telefone.getText().toString().trim();
        String sEndereco = endereco.getText().toString().trim();
        String sCurso = curso.getText().toString().trim();

        // Verifica campos vazios
        if (sNome.isEmpty()) {
            nome.setError("Digite o nome");
            return;
        }

        if (sCpf.isEmpty()) {
            cpf.setError("Digite o CPF");
            return;
        }

        if (!dao.isCPFValido(sCpf)) {
            cpf.setError("CPF inválido");
            return;
        }

        if (sTelefone.isEmpty()) {
            telefone.setError("Digite o telefone");
            return;
        }

        if (!dao.isTelefoneValido(sTelefone)) {
            telefone.setError("Telefone inválido");
            return;
        }

        if (sEndereco.isEmpty()) {
            endereco.setError("Digite o endereço");
            return;
        }

        if (sCurso.isEmpty()) {
            curso.setError("Digite o curso");
            return;
        }

        // Se todos os campos estão preenchidos
        Aluno a = new Aluno();
        a.setNome(sNome);
        a.setCpf(sCpf);
        a.setTelefone(sTelefone);
        a.setEndereco(sEndereco);
        a.setCurso(sCurso);

        long id = dao.inserir(a);
        Toast.makeText(this, "Aluno inserido com id: " + id, Toast.LENGTH_SHORT).show();
    }

    public void irParaListar(View view) {
        Intent intent = new Intent(this, ListarAlunosActivity.class);
        startActivity(intent);
    }

}