package com.uxopousa.granokshub.controller;

import com.uxopousa.granokshub.dto.PedidoDto;
import com.uxopousa.granokshub.service.PedidoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PedidoController {

  private final PedidoService pedidoService;

  public PedidoController(PedidoService pedidoService) {
    this.pedidoService = pedidoService;
  }

  @GetMapping("/pedidos")
  public PedidoDto consultaPedido(@RequestParam Long codPedido) {
    return pedidoService.consultaPedido(codPedido);
  }
}
