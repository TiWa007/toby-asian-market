package com.asianmarket.backend.model;


import javax.persistence.*;

@Entity
@Table(name="product_list")
public class Product {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long productId;

    @Column(length = 40, nullable = false)
    private String name;
    @Column(length = 20, nullable = false)
    private String category;
    @Column(length = 1000)
    private String description;
    @Column(length = 20, nullable = false)
    private String brand;
    @Column(nullable = false)
    private Double price;

    private Integer isSale;
    private Integer salePercentage;
    private String imagePath;

    protected Product() {
    }

    public Product(String name, String category, String description, String brand,
                   Double price, Integer isSale, Integer salePercentage, String imagePath) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.brand = brand;
        this.price = price;
        this.isSale = isSale;
        this.salePercentage = salePercentage;
        this.imagePath = imagePath;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getIsSale() {
        return isSale;
    }

    public void setIsSale(Integer isSale) {
        this.isSale = isSale;
    }

    public Integer getSalePercentage() {
        return salePercentage;
    }

    public void setSalePercentage(Integer salePercentage) {
        this.salePercentage = salePercentage;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
}
