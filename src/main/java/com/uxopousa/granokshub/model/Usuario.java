package com.uxopousa.granokshub.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name ="usuario")

public class Usuario {

    @Id
    private String username;

    private int puntos = 0;

    public Usuario() {}

    public Usuario(String username) {
        this.username = username;
    }

    // getters & setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public int getPuntos() {
        return puntos;
    }
    public void setPuntos(int puntos) {
        this.puntos = puntos;
    }
}