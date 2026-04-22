package com.example.firstapp;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ViaCepService {
    @GET("{cep}/json/")
    Call<CepDTO> buscarCep(@Path("cep") String cep);
}