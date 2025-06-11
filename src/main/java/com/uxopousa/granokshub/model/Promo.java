package com.uxopousa.granokshub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "promo")
public class Promo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private int costePuntos;

    public Promo() {}

    // getters & setters
    public Long getId() {
        return id;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public int getCostePuntos() {
        return costePuntos;
    }
    public void setCostePuntos(int costePuntos) {
        this.costePuntos = costePuntos;
    }
}