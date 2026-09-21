package com.example.demo.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    // Matches the frontend's Product['category']: 'Optical' | 'Sun' | 'Blue light'
    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String price;

    // Public URL the browser can load, e.g. "/images/3f2c1a-frame.jpg"
    @Column(nullable = false)
    private String image;

    private String tone;

    @Column(length = 2000)
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_details", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "detail")
    private List<String> details = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    private List<String> colors = new ArrayList<>();

    private String badge;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Product() {
    }

    public Product(String id, String name, String category, String price, String image, String tone, String description, String badge) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        this.tone = tone;
        this.description = description;
        this.badge = badge;
    }
    
    // --- getters and setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTone() { return tone; }
    public void setTone(String tone) { this.tone = tone; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getDetails() { return details; }
    public void setDetails(List<String> details) { this.details = details; }

    public List<String> getColors() { return colors; }
    public void setColors(List<String> colors) { this.colors = colors; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}