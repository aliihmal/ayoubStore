package com.example.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    // Stored OUTSIDE src/main/resources on purpose: files packaged inside the
    // jar are read-only at runtime, so an image saved there wouldn't survive
    // or even be writable once the app is built and running. An external
    // folder, mapped to a URL in WebConfig, can be written to and served
    // while the app is live.
    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/webp", "image/gif");

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("No file was uploaded.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Only JPEG, PNG, WEBP or GIF images are allowed.");
        }

        Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(directory);

        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image");
        String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String fileName = UUID.randomUUID() + extension;

        Path target = directory.resolve(fileName);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        // Matches the "/images/**" resource mapping registered in WebConfig.
        return "/images/" + fileName;
    }
}