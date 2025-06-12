package com.uxopousa.granokshub.service;

import com.uxopousa.granokshub.dto.PedidoDto;
import java.util.List;

public interface PedidoService {
 PedidoDto consultaPedido(Long codPedido);

 List<PedidoDto> consultaPedido();
}
