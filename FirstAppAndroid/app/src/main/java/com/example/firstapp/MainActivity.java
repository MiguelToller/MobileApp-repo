package com.example.firstapp;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;
import android.Manifest;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.ByteArrayOutputStream;

public class MainActivity extends AppCompatActivity {

    private EditText nome;
    private EditText cpf;
    private EditText telefone;
    private EditText endereco;
    private EditText curso;
    private AlunoDao dao;
    private Aluno aluno = null;
    private ImageView imageView;
    private static final int CAMERA_PERMISSION_CODE = 100;
    private static final int REQUEST_IMAGE_CAPTURE = 200;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        nome = findViewById(R.id.editNome);
        cpf = findViewById(R.id.editCPF);
        telefone = findViewById(R.id.editTelefone);
        endereco = findViewById(R.id.editEndereco);
        curso = findViewById(R.id.editCurso);
        imageView = findViewById(R.id.imageView);
        Button btnTakePhoto = findViewById(R.id.btnTakePhoto);

        dao = new AlunoDao(this);

        Intent intent = getIntent(); // Obtem a intenção que iniciou a Activity

        if (intent.hasExtra("aluno")) {

            // Recupera o objeto aluno enviado pela Intent
            aluno = (Aluno) intent.getSerializableExtra("aluno");

            // Preenche os campos com os dados do aluno
            nome.setText(aluno.getNome() != null ? aluno.getNome() : "");
            cpf.setText(aluno.getCpf() != null ? aluno.getCpf() : "");
            telefone.setText(aluno.getTelefone() != null ? aluno.getTelefone() : "");
            endereco.setText(aluno.getEndereco() != null ? aluno.getEndereco() : "");
            curso.setText(aluno.getCurso() != null ? aluno.getCurso() : "");

            byte[] fotoBytes = aluno.getFotoBytes();
            if (fotoBytes != null && fotoBytes.length > 0) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(fotoBytes, 0, fotoBytes.length);
                imageView.setImageBitmap(bitmap);
            }
        }
    }

    // Método para botão salvar quando clicado
    public void salvar(View view){
        String nomeDigitado = nome.getText().toString().trim();
        String cpfDigitado = cpf.getText().toString().trim();
        String telefoneDigitado = telefone.getText().toString().trim();
        String enderecoDigitado = endereco.getText().toString().trim();
        String cursoDigitado = curso.getText().toString().trim();

        // Verifica se os campos estão vazios
        if (nomeDigitado.isEmpty() || cpfDigitado.isEmpty() || telefoneDigitado.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos!", Toast.LENGTH_SHORT).show();
            return;
        }

        // aluno ==null cadastrar, aluno!=null esta recebendo do ListarAlunos
        if (aluno == null) {
            // Criar objeto Aluno
            aluno = new Aluno();
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
        else {
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

    //--------------------MÉTODOS DA CAMERA --------------------------------------------------------------------

    /**
     * Método chamado pelo clique do botão "Tirar Foto" (android:onClick no XML).
     * Sua principal função é verificar se o usuário já permitiu o uso da câmera.
     */
    public void tirarFoto(View view) {
        // Verifica se a permissão de CAMERA já foi concedida anteriormente
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            // Se NÃO tem permissão, abre a janelinha do sistema pedindo a autorização.
            // O código CAMERA_PERMISSION_CODE (100) serve para identificarmos esta resposta depois.
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_PERMISSION_CODE);
        } else {
            startCamera();
        }
    }

    /**
     * Método chamado automaticamente após o usuário responder à solicitação de permissão.
     * @param requestCode O código (100) que enviamos lá no tirarFoto.
     * @param permissions O array de permissões solicitadas.
     * @param grantResults O resultado (concedido ou negado) para cada permissão.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        // Verifica se a resposta que chegou é referente ao nosso pedido de câmera (código 100)
        if (requestCode == CAMERA_PERMISSION_CODE) {
            // Verifica se o array de resultados não está vazio e se o usuário clicou em "Permitir"
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d("CAMERA_DEBUG", "Usuário permitiu, abrindo câmera...");
                startCamera();
            } else {
                // Se o usuário negou, avisamos que ele não conseguirá tirar fotos.
                Toast.makeText(this, "A permissão é necessária para usar a câmera.", Toast.LENGTH_SHORT).show();
            }
        }
    }

    /**
     * Método auxiliar que cria a "Intenção" de abrir o aplicativo de câmera do dispositivo.
     */
    private void startCamera() {
        try {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        } catch (Exception e) {
            Log.e("CAMERA_DEBUG", "Erro ao abrir a câmera: " + e.getMessage());
            Toast.makeText(this, "Erro ao abrir a câmera no seu dispositivo.", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Método chamado quando uma atividade que iniciamos (como a câmera) termina e nos devolve dados.
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK && data != null) {

            Bundle extras = data.getExtras();

            if (extras != null && extras.get("data") != null) {
                Bitmap imageBitmap = (Bitmap) extras.get("data");

                imageView.setImageBitmap(imageBitmap);

                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                imageBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
                byte[] byteArray = stream.toByteArray();

                if (aluno == null) {
                    aluno = new Aluno();
                }

                aluno.setFotoBytes(byteArray);
            }
        }
    }

}