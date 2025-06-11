package com.uxopousa.granokshub.repo;

import com.uxopousa.granokshub.model.Promo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromoRepository extends JpaRepository<Promo, Long> {
}