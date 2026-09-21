package com.example.demo.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.FileStorageService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.owner.password}")
    private String ownerPassword;

    public ProductController(ProductRepository productRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
    }

    // Public: anyone visiting the store can read the list.
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc();
    }

    // Owner-only: adds a new frame, saving the image to disk in the same request.
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(
            @RequestHeader("X-Owner-Password") String suppliedPassword,
            @RequestParam("image") MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") String price,
            @RequestParam(value = "tone", required = false, defaultValue = "") String tone,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam(value = "details", required = false, defaultValue = "") String details,
            @RequestParam(value = "colors", required = false, defaultValue = "") String colors,
            @RequestParam(value = "badge", required = false) String badge
    ) {
        if (!ownerPassword.equals(suppliedPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect owner password."));
        }
        if (!List.of("Optical", "Sun", "Blue light").contains(category)) {
            return ResponseEntity.badRequest().body(Map.of("error", "category must be Optical, Sun, or Blue light."));
        }

        try {
            String imagePath = fileStorageService.store(image);

            Product product = new Product();
            product.setId(UUID.randomUUID().toString());
            product.setName(name);
            product.setCategory(category);
            product.setPrice(price);
            product.setImage(imagePath);
            product.setTone(tone);
            product.setDescription(description);
            product.setDetails(splitCommaList(details));
            product.setColors(splitCommaList(colors));
            product.setBadge(badge != null && !badge.isBlank() ? badge : null);

            Product saved = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Could not save the image."));
        }
    }

    private List<String> splitCommaList(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}