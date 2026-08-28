package com.example.inventory.repository;

import com.example.inventory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query("SELECT c.id, c.name, c.description, COUNT(p) FROM Category c LEFT JOIN c.products p GROUP BY c.id, c.name, c.description ORDER BY c.name ASC")
    List<Object[]> findCategoriesWithProductCount();
}
