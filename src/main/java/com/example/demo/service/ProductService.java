package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ProductDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private CategoryService categoryService;

    public Product saveProduct(ProductDTO productDTO) {
        Category category = categoryService.getCategoryById(productDTO.getCategoryId());
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCategory(category);
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());

        return repository.save(product);
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, ProductDTO productDTO) {
        Product product = getProductById(id);
        Category category = categoryService.getCategoryById(productDTO.getCategoryId());

        product.setName(productDTO.getName());
        product.setCategory(category);
        product.setQuantity(productDTO.getQuantity());
        product.setPrice(productDTO.getPrice());

        return repository.save(product);
    }

    public List<Product> searchProducts(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        repository.delete(product);
    }

    public double calculateInventoryValue() {

        double totalValue = 0;

        List<Product> products = repository.findAll();

        for (Product p : products) {
            totalValue += p.getPrice() * p.getQuantity();
        }

        return totalValue;
    }
}