package com.uxopousa.granokshub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String producto;
    private double total;

    @ManyToOne
    @JoinColumn(name = "usuario_username")
    private Usuario usuario;

    public Pedido() {}

    // getters & setters
    public Long getId() {
        return id;
    }
    public String getProducto() {
        return producto;
    }
    public void setProducto(String producto) {
        this.producto = producto;
    }
    public double getTotal() {
        return total;
    }
    public void setTotal(double total) {
        this.total = total;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}