package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.User;
import com.example.demo.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(String name, Long userId) {
        if (categoryRepository.existsByNameAndUserId(name, userId)) {
            throw new IllegalArgumentException("Category with name '" + name + "' already exists.");
        }
        Category category = new Category(name);
        User user = new User();
        user.setId(userId);
        category.setUser(user);
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    public Category getCategoryByIdAndUserId(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (category.getUser() == null || !category.getUser().getId().equals(userId)) {
             throw new SecurityException("Unauthorized access to category");
        }
        return category;
    }

    public void deleteCategory(Long id, Long userId) {
        Category category = getCategoryByIdAndUserId(id, userId);
        categoryRepository.delete(category);
    }
}
