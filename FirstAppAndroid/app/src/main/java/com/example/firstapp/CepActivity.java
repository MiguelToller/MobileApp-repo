package com.example.firstapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CepActivity extends AppCompatActivity {

    private EditText editCep, editLogradouro, editBairro, editCidade, editEstado, editComplemento, editNumero;
    private Button btnBuscarCep;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cep);

        // Inicializando os componentes conforme seus IDs do XML
        editCep = findViewById(R.id.editCep);
        editLogradouro = findViewById(R.id.editLogradouro);
        editBairro = findViewById(R.id.editBairro);
        editCidade = findViewById(R.id.editCidade);
        editEstado = findViewById(R.id.editEstado);
        editComplemento = findViewById(R.id.editComplemento);
        editNumero = findViewById(R.id.editNumero); // No seu XML o ID está 'rua' mas a hint é 'Número'
        btnBuscarCep = findViewById(R.id.btnBuscarCep);

        btnBuscarCep.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                buscarDadosViaCep();
            }
        });
    }

    private void buscarDadosViaCep() {
        String cepDigitado = editCep.getText().toString().trim();

        if (cepDigitado.isEmpty() || cepDigitado.length() < 8) {
            Toast.makeText(this, "Digite um CEP válido", Toast.LENGTH_SHORT).show();
            return;
        }

        // Configuração do Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://viacep.com.br/ws/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        ViaCepService service = retrofit.create(ViaCepService.class);
        Call<CepDTO> call = service.buscarCep(cepDigitado);

        // Chamada Assíncrona
        call.enqueue(new Callback<CepDTO>() {
            @Override
            public void onResponse(Call<CepDTO> call, Response<CepDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    CepDTO dados = response.body();

                    if (dados.getLogradouro() == null) {
                        Toast.makeText(CepActivity.this, "CEP não encontrado", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    // Preenchendo seus EditTexts com o retorno da API
                    editLogradouro.setText(dados.getLogradouro());
                    editBairro.setText(dados.getBairro());
                    editCidade.setText(dados.getLocalidade());
                    editEstado.setText(dados.getUf());

                    // Foca no campo número para o usuário completar o endereço
                    editNumero.requestFocus();
                } else {
                    Toast.makeText(CepActivity.this, "Erro na resposta do servidor", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<CepDTO> call, Throwable t) {
                Toast.makeText(CepActivity.this, "Erro de rede: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void finalizarEndereco(View view) {
        // 1. Pegar os dados de todos os campos
        String logradouro = editLogradouro.getText().toString();
        String numero = editNumero.getText().toString();
        String complemento = editComplemento.getText().toString();
        String bairro = editBairro.getText().toString();
        String cidade = editCidade.getText().toString();
        String estado = editEstado.getText().toString();

        // 2. Formatar o endereço conforme solicitado (Ex: Rua X, 100, Ap 2 - Bairro)
        String enderecoFormatado = logradouro + ", " + numero;
        if (!complemento.isEmpty()) {
            enderecoFormatado += " (" + complemento + ")";
        }
        enderecoFormatado += " - " + bairro + ", " + cidade + "/" + estado;

        // 3. Criar uma Intent para devolver o resultado
        Intent intentResultado = new Intent();
        intentResultado.putExtra("endereco_completo", enderecoFormatado);

        // 4. Definir o resultado como OK e fechar a tela
        setResult(RESULT_OK, intentResultado);
        finish();
    }
}