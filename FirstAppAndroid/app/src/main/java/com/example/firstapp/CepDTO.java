package com.example.firstapp;

public class CepDTO {
    // Os nomes devem ser iguais aos que o ViaCEP retorna no JSON
    private String logradouro;
    private String bairro;
    private String localidade; // Cidade
    private String uf;         // Estado

    // Getters
    public String getLogradouro() { return logradouro; }
    public String getBairro() { return bairro; }
    public String getLocalidade() { return localidade; }
    public String getUf() { return uf; }
}