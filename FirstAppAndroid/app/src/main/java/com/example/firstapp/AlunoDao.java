package com.example.firstapp;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.ArrayList;
import java.util.List;

public class AlunoDao {

    private Conexao conexao;
    private SQLiteDatabase banco;

    public AlunoDao(Context context) {
        conexao = new Conexao(context);
        banco = conexao.getWritableDatabase();
    }

    public long inserir(Aluno aluno) {
        ContentValues values = new ContentValues();
        values.put("nome", aluno.getNome());
        values.put("cpf", aluno.getCpf());
        values.put("telefone", aluno.getTelefone());
        values.put("endereco", aluno.getEndereco());
        values.put("curso", aluno.getCurso());
        return banco.insert("aluno", null, values);
    }

    public List<Aluno> obterTodos() {
        List<Aluno> alunos = new ArrayList<>();
        // cursor aponta para as linhas retornadas
        Cursor cursor = banco.query(
                "aluno",
                new String[]{"id", "nome", "cpf", "telefone", "endereco", "curso"},
                null,
                null,
                null,
                null,
                null
        );

        // percorre todas as linhas retornadas
        while (cursor.moveToNext()) {

            Aluno a = new Aluno();

            // new String[]{"id","nome","cpf","telefone"}
            a.setId(cursor.getInt(0));        // id = coluna 0
            a.setNome(cursor.getString(1));   // nome = coluna 1
            a.setCpf(cursor.getString(2));    // cpf = coluna 2
            a.setTelefone(cursor.getString(3)); // telefone = coluna 3

            alunos.add(a);
        }

        return alunos;
    }

    // Valida CPF
    public boolean isCPFValido(String cpf) {
        cpf = cpf.replace(".", "").replace("-", "").trim();

        if (cpf.length() != 11) return false;
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int[] numeros = new int[11];
            for (int i = 0; i < 11; i++) {
                numeros[i] = Integer.parseInt(cpf.substring(i, i + 1));
            }

            int soma = 0;
            for (int i = 0; i < 9; i++) soma += numeros[i] * (10 - i);
            int dig1 = 11 - (soma % 11);
            if (dig1 >= 10) dig1 = 0;

            soma = 0;
            for (int i = 0; i < 10; i++) soma += numeros[i] * (11 - i);
            int dig2 = 11 - (soma % 11);
            if (dig2 >= 10) dig2 = 0;

            return dig1 == numeros[9] && dig2 == numeros[10];
        } catch (Exception e) {
            return false;
        }
    }

    // Valida telefone
    public boolean isTelefoneValido(String telefone) {
        telefone = telefone.replaceAll("[\\s()-]", "").trim();
        if (telefone.length() != 10 && telefone.length() != 11) return false;
        return telefone.matches("\\d+");
    }
}
