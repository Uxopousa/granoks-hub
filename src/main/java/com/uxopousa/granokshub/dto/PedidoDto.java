package com.uxopousa.granokshub.dto;

import java.io.Serializable;
import lombok.Value;

/**
 * DTO for {@link com.uxopousa.granokshub.model.Pedido}
 */
@Value
public class PedidoDto implements Serializable {

  Long id;
  String producto;
  double total;
  UsuarioDto usuario;
}