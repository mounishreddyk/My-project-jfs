package com.example.demo.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Product;
import com.example.demo.dto.CategoryValueDTO;
import java.util.List;

import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUserIdAndNameContainingIgnoreCase(Long userId, String name);

    List<Product> findByUserIdAndCategoryNameIgnoreCase(Long userId, String categoryName);

    List<Product> findByUserId(Long userId);
    
    long countByUserId(Long userId);

    @Query("SELECT new com.example.demo.dto.CategoryValueDTO(c.name, SUM(p.price * p.quantity)) " +
            "FROM Product p JOIN p.category c WHERE p.user.id = :userId GROUP BY c.name")
    List<CategoryValueDTO> findCategoryInventoryValuesByUserId(@Param("userId") Long userId);
}