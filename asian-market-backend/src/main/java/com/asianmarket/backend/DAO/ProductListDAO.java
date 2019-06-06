package com.asianmarket.backend.DAO;

import com.asianmarket.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProductListDAO extends JpaRepository<Product, Long> {

    // Find by category
//    Page<Product> findAllBy(Pageable pageProduct);
//    Page<Product> findByIsSale(Integer isSale, Pageable pageProduct);
//    Page<Product> findByCategory(String category, Pageable pageProduct);
    @Query(value = "select p from Product p " +
            "where (:category = 'allProduct') or (:category = 'Sale' and p.isSale = 1) or (p.category = :category) " +
            "or (:category = 'Search' and (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%))")
    Page<Product> findProductList(@Param("category") String category, @Param("searchKey") String searchKey, Pageable pageProduct);

    // Find minPrice and maxPrice
    @Query(value = "select min(p.price), max(p.price) from Product p " +
            "where (:category = 'allProduct') or (:category = 'Sale' and p.isSale = 1) or (p.category = :category) " +
            "or (:category = 'Search' and (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%))")
    String findPriceRange(@Param("category") String category, @Param("searchKey") String searchKey);

    // Find brand list
    @Query(value = "select distinct p.brand from Product p " +
            "where (:category = 'allProduct') or (:category = 'Sale' and p.isSale = 1) or (p.category = :category) " +
            "or (:category = 'Search' and (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%))" +
            "order by p.brand")
    List<String> findBrandList(@Param("category") String category, @Param("searchKey") String searchKey);

    //Find product
    // brand is null
    @Query(value = "select p from Product p " +
            "where (:category is null or p.category = :category) " +
            "and (:isSale = null or p.isSale = :isSale) " +
            "and (:searchKey is null or (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%)) " +
            "and ((:minPrice is null or p.price >= :minPrice) and (:maxPrice is null or p.price <= :maxPrice))"
    )
    Page<Product> findProductWithoutBrand1(@Param("category") String category, @Param("isSale") Integer isSale,
                                           @Param("searchKey") String searchKey,
                                           @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice,
                                           Pageable pageProduct);
    // brand is not null
    @Query(value = "select p from Product p " +
            "where (:category is null or p.category = :category) " +
            "and (:isSale = null or p.isSale = :isSale) " +
            "and p.brand in :brand " +
            "and (:searchKey is null or (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%)) " +
            "and ((:minPrice is null or p.price >= :minPrice) and (:maxPrice is null or p.price <= :maxPrice))"
    )
    Page<Product> findProductByFind1(@Param("category") String category, @Param("isSale") Integer isSale, @Param("brand") String[] brand,
                                     @Param("searchKey") String searchKey,
                                    @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice,
                                    Pageable pageProduct);

}

//    //Find product
//    // brand is null
//    @Query(value = "select p from Product p " +
//            "where (:category is null or p.category = :category) " +
//            "and (:isSale = null or p.isSale = :isSale) " +
//            "and (:searchKey is null or (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%)) " +
//            "and ((:minPrice is null or p.price >= :minPrice) and (:maxPrice is null or p.price <= :maxPrice))"
//    )
//    List<Product> findProductWithoutBrand(@Param("category") String category, @Param("isSale") Integer isSale, @Param("searchKey") String searchKey,
//                                          @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice,
//                                          Pageable pageProduct);
//    // brand is not null
//    @Query(value = "select p from Product p " +
//            "where (:category is null or p.category = :category) " +
//            "and (:isSale = null or p.isSale = :isSale) " +
//            "and p.brand in :brand " +
//            "and (:searchKey is null or (p.brand like %:searchKey% or p.name like %:searchKey% or p.category like %:searchKey%)) " +
//            "and ((:minPrice is null or p.price >= :minPrice) and (:maxPrice is null or p.price <= :maxPrice))"
//    )
//    List<Product> findProductByFind(@Param("category") String category, @Param("isSale") Integer isSale, @Param("brand") String[] brand, @Param("searchKey") String searchKey,
//                                    @Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice,
//                                    Pageable pageProduct);
