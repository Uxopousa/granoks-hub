package com.uxopousa.granokshub.dto;

import java.io.Serializable;
import lombok.Value;

/**
 * DTO for {@link com.uxopousa.granokshub.model.Usuario}
 */
@Value
public class UsuarioDto implements Serializable {

  String username;
  int puntos;
}