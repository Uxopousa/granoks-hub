package com.uxopousa.granokshub.service.impl;

import com.uxopousa.granokshub.dto.PedidoDto;
import com.uxopousa.granokshub.mapper.PedidoMapper;
import com.uxopousa.granokshub.repo.PedidoRepository;
import com.uxopousa.granokshub.service.PedidoService;
import org.springframework.stereotype.Service;

@Service
public class PedidoServiceImpl implements PedidoService {

  private final PedidoRepository pedidoRepository;
  private final PedidoMapper pedidoMapper;

  public PedidoServiceImpl(PedidoRepository pedidoRepository, PedidoMapper pedidoMapper) {
    this.pedidoRepository = pedidoRepository;
    this.pedidoMapper = pedidoMapper;
  }

  @Override
  public PedidoDto consultaPedido(Long codPedido) {
    return pedidoMapper.toDto(pedidoRepository.findById(codPedido).orElse(null));
  }
}
