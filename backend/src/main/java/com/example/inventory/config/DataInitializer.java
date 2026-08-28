package com.example.inventory.config;

import com.example.inventory.entity.Category;
import com.example.inventory.entity.Product;
import com.example.inventory.repository.CategoryRepository;
import com.example.inventory.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataInitializer(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Category oils = new Category("Cold Pressed Oils", "Pure traditional wood-pressed oils (Lakadi Ghana)");
            Category grains = new Category("Organic Grains & Flours", "Naturally grown unpolished grains, pulses and flours");
            Category spices = new Category("Traditional Spices", "Authentic stone-ground organic spices and herbs");
            Category sweeteners = new Category("Natural Sweeteners", "Pure organic jaggery, honey and date syrup");
            Category woodcraft = new Category("Wooden Utensils & Crafts", "Handcrafted neem and teak wood kitchenware");

            categoryRepository.saveAll(List.of(oils, grains, spices, sweeteners, woodcraft));

            List<Product> sampleProducts = List.of(
                    new Product("Wood Pressed Groundnut Oil (1 Litre)", "OIL-GND-1L", "Pure wood-churned peanut oil, unrefined and chemical-free.", new BigDecimal("340.00"), 45, 10, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60", oils),
                    new Product("Cold Pressed Sesame (Til) Oil (500ml)", "OIL-SES-500M", "Traditional black sesame oil with rich aroma and nutrients.", new BigDecimal("260.00"), 28, 8, "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop&q=60", oils),
                    new Product("Pure Mustard Oil / Sarson (1 Litre)", "OIL-MST-1L", "Pungent, cold-pressed golden mustard seed oil.", new BigDecimal("220.00"), 12, 15, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60", oils),
                    new Product("Extra Virgin Coconut Oil (500ml)", "OIL-COC-500M", "Raw, cold-pressed organic coconut oil for cooking and skin.", new BigDecimal("310.00"), 4, 10, "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60", oils),
                    new Product("Organic Jaggery Powder (1 Kg)", "SWT-JAG-1K", "Chemical-free unrefined desi cane jaggery powder.", new BigDecimal("130.00"), 60, 15, "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500&auto=format&fit=crop&q=60", sweeteners),
                    new Product("Raw Forest Honey (500g)", "SWT-HNY-500G", "Wild unprocessed multi-flora forest bee honey.", new BigDecimal("450.00"), 0, 5, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60", sweeteners),
                    new Product("Salem Turmeric Powder (250g)", "SPC-TRM-250G", "High-curcumin organic turmeric ground slowly at low temperature.", new BigDecimal("110.00"), 35, 10, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60", spices),
                    new Product("Handcrafted Neem Wood Spatula Set", "WOD-SPT-SET3", "Pack of 3 heat-resistant anti-bacterial wooden ladles.", new BigDecimal("299.00"), 18, 5, "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500&auto=format&fit=crop&q=60", woodcraft),
                    new Product("Organic Khapli (Emmer) Wheat Flour (2 Kg)", "GRN-KHP-2K", "Ancient grain low GI stone ground whole wheat flour.", new BigDecimal("240.00"), 2, 8, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", grains)
            );

            productRepository.saveAll(sampleProducts);
        }
    }
}
