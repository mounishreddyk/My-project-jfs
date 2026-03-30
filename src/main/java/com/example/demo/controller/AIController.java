package com.example.demo.controller;

import com.example.demo.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/query")
    public ResponseEntity<String> query(@RequestBody String query) {
        String response = aiService.processQuery(query);
        return ResponseEntity.ok(response);
    }
}