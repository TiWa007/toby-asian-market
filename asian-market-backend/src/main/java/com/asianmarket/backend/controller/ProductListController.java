package com.asianmarket.backend.controller;

import com.asianmarket.backend.DAO.ProductListDAO;
import com.asianmarket.backend.model.Product;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class ProductListController {

    @Autowired
    private ProductListDAO productListDAO;

    private final int pageSize = 8;
    private Page<Product> productList;

    // get products from database according to category where imagePath is encodeBase64
    @GetMapping(path = "/products/{category}")
    public ResponseEntity<Page<Product>> getProductByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "") String searchKey,
            @RequestParam(defaultValue = "0") Integer pageNo
    ) throws IOException {
        HttpHeaders responseHeaders = new HttpHeaders();
        Pageable pageProduct = PageRequest.of(pageNo, pageSize);
        Page<Product> productList = productListDAO.findProductList(category, searchKey, pageProduct);
        updateProductListWithImageURI1(productList);
        return new ResponseEntity<Page<Product>>(productList, responseHeaders, HttpStatus.ACCEPTED);
    }

    // get brand list
    @GetMapping(path = "/products/{category}/brandlist")
    public ResponseEntity<List<String>> getBrandList(
            @PathVariable String category,
            @RequestParam(defaultValue = "") String searchKey
    ) throws IOException {
        return new ResponseEntity<List<String>>(productListDAO.findBrandList(category, searchKey), HttpStatus.ACCEPTED);
    }

    // get price range
    @GetMapping(path = "/products/{category}/pricerange")
    public ResponseEntity<String[]> getPriceRange(
            @PathVariable String category,
            @RequestParam(defaultValue = "") String searchKey
    ) throws IOException {
        String response = productListDAO.findPriceRange(category, searchKey);
        String[] priceList = response.split(",");
        return new ResponseEntity<String[]>(priceList, HttpStatus.ACCEPTED);
    }

    // Page
    @GetMapping(path = "/products/{category}/find")
    public ResponseEntity<Page<Product>> getProductByCategoryAndBySort(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") Integer pageNo,
            @RequestParam(required = false) String[] brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String searchKey
    ) throws IOException {
        HttpHeaders responseHeaders = new HttpHeaders();
        Page<Product> productList = Page.empty();

        // Select by category
        String productCategory = category;
        Integer isSale = null;

        if (category.equalsIgnoreCase("Sale")) {
            isSale = 1;
            productCategory = null;
        } else if (category.equalsIgnoreCase("allProduct") || category.equalsIgnoreCase("Search")) {
            productCategory = null;
        }

        // Sort
        Sort.Direction dir = Sort.Direction.ASC;
        String sortPara = "productId";
        if (sort != null) {
            switch (sort) {
                case "popularity": {
                    break;
                }
                case "priceAsc": {
                    sortPara = "price";
                    break;
                }
                case "priceDesc": {
                    sortPara = "price";
                    dir = Sort.Direction.DESC;
                    break;
                }
                case "name": {
                    sortPara = "name";
                    break;
                }
                case "sale": {
                    sortPara = "salePercentage";
                }
            }
        }

        // Pageable
        Pageable pageProduct = PageRequest.of(pageNo, pageSize, dir, sortPara);

        if (brand == null) {
            productList = productListDAO.findProductWithoutBrand1(productCategory, isSale, searchKey, minPrice, maxPrice, pageProduct);
        }
        else {
            productList= productListDAO.findProductByFind1(productCategory, isSale, brand, searchKey, minPrice, maxPrice, pageProduct);
        }

        updateProductListWithImageURI1(productList);
        return new ResponseEntity<Page<Product>>(productList, responseHeaders, HttpStatus.ACCEPTED);
    }

    private void updateProductListWithImageURI1(Page<Product> productList) throws IOException {
        File imageFolder = new File("./src/main/resources/static/images/productImage");
        HashMap<String, String> imageMap = new HashMap<>();
        for (File file : imageFolder.listFiles()) {
            InputStream in = new FileInputStream(file);
            byte[] bytes = IOUtils.toByteArray(in);
            String encodeBase64 = Base64.getEncoder().encodeToString(bytes);
            encodeBase64 = "data:image/jpeg;base64," + encodeBase64;
            imageMap.put(file.getName(), encodeBase64);
        }
        for(Product product: productList) {
            product.setImagePath(imageMap.get(product.getImagePath()));
        }
    }

    public void set() throws IOException {
//        InputStream in = getClass().getResourceAsStream("/static/images/productImage/1.jpg");
//        byte[] bytes = IOUtils.toByteArray(in);
////        System.out.println(Base64.getMimeEncoder(1, bytes).toString());
//        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
//        BufferedImage bImage2 = ImageIO.read(bis);
//        ImageIO.write(bImage2, "jpg", new File("./src/main/resources/static/images/productImage/output.jpg"));
        File dir = new File("./src/main/resources/static/images/productImage");

        for (File f : dir.listFiles()) {
            System.out.println(f.getName());
        }
        System.out.println(dir.getName());

        List<String> images = new ArrayList<String>();
//        File dir = new File("./src/main/resources/static/images/productImage");
        for (File file : dir.listFiles()) {
            InputStream in = new FileInputStream(file);
            byte[] bytes = IOUtils.toByteArray(in);
            String encodeBase64 = Base64.getEncoder().encodeToString(bytes);
            encodeBase64 = "data:image/jpeg;base64," + encodeBase64;
            System.out.println(encodeBase64);
            images.add(encodeBase64);
        }

        List<Product> productList = productListDAO.findAll(Sort.by(Sort.Direction.ASC, "price"));
    }

    public static void main(String[] args) throws IOException {
        ProductListController pc = new ProductListController();
        pc.set();


    }

}

//    private void updateProductListWithImageURI(List<Product> productList) throws IOException {
//        File imageFolder = new File("./src/main/resources/static/images/productImage");
//        HashMap<String, String> imageMap = new HashMap<>();
//        for (File file : imageFolder.listFiles()) {
//            InputStream in = new FileInputStream(file);
//            byte[] bytes = IOUtils.toByteArray(in);
//            String encodeBase64 = Base64.getEncoder().encodeToString(bytes);
//            encodeBase64 = "data:image/jpeg;base64," + encodeBase64;
//            imageMap.put(file.getName(), encodeBase64);
//        }
//        for(Product product: productList) {
//            product.setImagePath(imageMap.get(product.getImagePath()));
//        }
//    }

//    // get products from database according to category where imagePath is encodeBase64
//    @GetMapping(path = "/products/{category}")
//    public ResponseEntity<List<Product>> getProductByCategory(
//            @PathVariable String category,
//            @RequestParam(defaultValue = "0") Integer pageNo
//            ) throws IOException {
//        HttpHeaders responseHeaders = new HttpHeaders();
//        List<Product> productList = new ArrayList<>();
//        Pageable pageProduct = PageRequest.of(pageNo, pageSize);
//        if (category.equalsIgnoreCase("allProduct"))
//            productList = productListDAO.findAllBy(pageProduct);
//        else if (category.equalsIgnoreCase("Sale")) {
//            productList = productListDAO.findByIsSale(1, pageProduct);
//        }
//        else {
//            productList = productListDAO.findByCategory(category, pageProduct);
//        }
//        updateProductListWithImageURI(productList);
//        return new ResponseEntity<List<Product>>(productList, responseHeaders, HttpStatus.ACCEPTED);
//    }


//    @GetMapping(path = "/products/{category}/find")
//    public ResponseEntity<List<Product>> getProductByFind(
//            @PathVariable String category,
//            @RequestParam(defaultValue = "0") Integer pageNo,
//            @RequestParam(required = false) String[] brand,
//            @RequestParam(required = false) Double minPrice,
//            @RequestParam(required = false) Double maxPrice,
//            @RequestParam(required = false) String sort,
//            @RequestParam(required = false) String searchKey
//    ) throws IOException {
//        HttpHeaders responseHeaders = new HttpHeaders();
//        List<Product> productList = new ArrayList<>();
//
//        // Select by category
//        String productCategory = null;
//        Integer isSale = null;
//
//        if (category.equalsIgnoreCase("Sale")) {
//            isSale = 1;
//        } else if (!category.equalsIgnoreCase("allProduct")) {
//            productCategory = category;
//        }
//
//        // Sort
//        Sort.Direction dir = Sort.Direction.ASC;
//        String sortPara = "productId";
//        if (sort != null) {
//            switch (sort) {
//                case "popularity": {
//                    break;
//                }
//                case "priceAsc": {
//                    sortPara = "price";
//                    break;
//                }
//                case "priceDesc": {
//                    sortPara = "price";
//                    dir = Sort.Direction.DESC;
//                    break;
//                }
//                case "name": {
//                    sortPara = "name";
//                    break;
//                }
//                case "sale": {
//                    sortPara = "salePercentage";
//                }
//            }
//        }
//
//        // Pageable
//        Pageable pageProduct = PageRequest.of(pageNo, pageSize, dir, sortPara);
//
//        if (brand == null) {
//            productList = productListDAO.findProductWithoutBrand(productCategory, isSale, searchKey, minPrice, maxPrice, pageProduct);
//        }
//        else {
//            productList= productListDAO.findProductByFind(productCategory, isSale, brand, searchKey, minPrice, maxPrice, pageProduct);
//        }
//
//        updateProductListWithImageURI(productList);
//        return new ResponseEntity<List<Product>>(productList, responseHeaders, HttpStatus.ACCEPTED);
//    }

//    // get products from database according to category where imagePath is encodeBase64
//    @GetMapping(path = "/products/{category}")
//    public ResponseEntity<Page<Product>> getProductByCategory(
//            @PathVariable String category,
//            @RequestParam(defaultValue = "0") Integer pageNo
//    ) throws IOException {
//        HttpHeaders responseHeaders = new HttpHeaders();
//        Page<Product> productList = Page.empty();
//        Pageable pageProduct = PageRequest.of(pageNo, pageSize);
//        if (category.equalsIgnoreCase("allProduct"))
//            productList = productListDAO.findAllBy(pageProduct);
//        else if (category.equalsIgnoreCase("Sale")) {
//            productList = productListDAO.findByIsSale(1, pageProduct);
//        }
//        else {
//            productList = productListDAO.findByCategory(category, pageProduct);
//        }
//        updateProductListWithImageURI1(productList);
//        return new ResponseEntity<Page<Product>>(productList, responseHeaders, HttpStatus.ACCEPTED);
//    }
