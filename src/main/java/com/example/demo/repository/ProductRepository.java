package com.example.demo.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.model.Product;
import com.example.demo.dto.CategoryValueDTO;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategoryNameIgnoreCase(String categoryName);

    @Query("SELECT new com.example.demo.dto.CategoryValueDTO(c.name, SUM(p.price * p.quantity)) " +
            "FROM Product p JOIN p.category c GROUP BY c.name")
    List<CategoryValueDTO> findCategoryInventoryValues();
}