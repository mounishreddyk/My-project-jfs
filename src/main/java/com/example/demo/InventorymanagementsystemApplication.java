package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import java.util.Arrays;

@SpringBootApplication
public class InventorymanagementsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventorymanagementsystemApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(CategoryRepository repository) {
		return (args) -> {
			if (repository.count() == 0) {
				repository.saveAll(Arrays.asList(
						new Category("Electronics"),
						new Category("Clothing"),
						new Category("Footwear"),
						new Category("Furniture"),
						new Category("Accessories")));
			}
		};
	}

}
