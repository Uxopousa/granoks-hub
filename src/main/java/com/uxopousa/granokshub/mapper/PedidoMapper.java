package com.uxopousa.granokshub.mapper;

import com.uxopousa.granokshub.dto.PedidoDto;
import com.uxopousa.granokshub.model.Pedido;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants.ComponentModel;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = ComponentModel.SPRING)
public interface PedidoMapper {

  Pedido toEntity(PedidoDto pedidoDto);

  PedidoDto toDto(Pedido pedido);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  Pedido partialUpdate(
      PedidoDto pedidoDto, @MappingTarget Pedido pedido);

  List<PedidoDto> toDto(List<Pedido> all);
}