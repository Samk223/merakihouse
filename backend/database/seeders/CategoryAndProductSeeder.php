<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoryAndProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Core Categories
        $categories = [
            [
                'name' => 'Hair Care',
                'slug' => 'hair-care',
                'description' => 'Premium, botanical-infused shampoo bars, nourishing serums, and natural remedies.',
                'image' => '/home/categories/hair_care_thumbnail.png',
                'display_order' => 1,
            ],
            [
                'name' => 'Body Care',
                'slug' => 'body-care',
                'description' => 'Organic, sustainable body washes, moisturizing lotions, rich butters, and gentle scrubs.',
                'image' => '/home/categories/body_care_thumbnail.png',
                'display_order' => 2,
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'description' => 'Cozy soy candles, reed diffusers, aromatherapeutic mists, and hand-crafted accessories.',
                'image' => '/home/categories/home_living_thumbnail.png',
                'display_order' => 3,
            ]
        ];

        $categoryModels = [];
        foreach ($categories as $catData) {
            $categoryModels[$catData['slug']] = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                    'image' => $catData['image'],
                    'display_order' => $catData['display_order'],
                    'is_active' => true,
                ]
            );
        }

        // 2. Define Products Data
        $productsData = [
            // --- Hair Care ---
            [
                'category_slug' => 'hair-care',
                'name' => 'Nourishing Shampoo Bar',
                'sku' => 'HC-SH-NOUR',
                'short_description' => 'Infused with Coconut Oil & Shea Butter for normal to dry hair.',
                'description' => 'Gently cleanse and deeply condition your hair with our botanical shampoo bar. Made with saponified plant oils, organic coconut, and raw shea butter, this bar restores natural moisture, body, and shine without stripping protective sebum.',
                'price' => 299.00,
                'compare_price' => 399.00,
                'stock' => 50,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/nourishing-shampoo.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Clarifying Charcoal Shampoo Bar',
                'sku' => 'HC-SH-CHAR',
                'short_description' => 'Deep detoxifying bar with Activated Charcoal & Tea Tree Oil.',
                'description' => 'Draw out scalp impurities, excess oils, and product buildup with activated charcoal. Formulated with tea tree and peppermint essential oils to refresh the scalp, relieve dandruff, and stimulate micro-circulation.',
                'price' => 319.00,
                'compare_price' => 420.00,
                'stock' => 35,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/charcoal-shampoo.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Hibiscus Repair Shampoo Bar',
                'sku' => 'HC-SH-HIBI',
                'short_description' => 'Fortified with Hibiscus extract & Red Clay to repair damaged locks.',
                'description' => 'Bring life back to dull, treated, or heat-damaged hair. Hibiscus flower extract contains natural amino acids that strengthen hair shafts, while red clay gently purifies, leaving locks voluminous and bouncy.',
                'price' => 329.00,
                'compare_price' => 450.00,
                'stock' => 60,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/hibiscus-shampoo.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Rice Water Shampoo Bar',
                'sku' => 'HC-SH-RICE',
                'short_description' => 'Fermented Rice Water extract for accelerated hair growth and strength.',
                'description' => 'Inspired by ancient Yao women ritual, our fermented rice water shampoo bar is rich in Inositol and proteins. It repairs damaged hair follicles, improves elasticity, and promotes thick, healthy growth.',
                'price' => 339.00,
                'compare_price' => 450.00,
                'stock' => 40,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/rice-water-shampoo.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Avocado Shea Shampoo Bar',
                'sku' => 'HC-SH-AVOC',
                'short_description' => 'Creamy moisturizing bar for curly, textured, or very dry hair.',
                'description' => 'Packed with organic avocado oil, cold-pressed jojoba, and dense shea butter. Perfect for defining curls, calming frizz, and injecting vital essential fatty acids directly into dehydrated hair fibers.',
                'price' => 349.00,
                'compare_price' => 450.00,
                'stock' => 45,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/avocado-shampoo.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Anti-Frizz Hair Serum',
                'sku' => 'HC-SR-FRIZ',
                'short_description' => 'Argan & Rosehip hair serum for glass-like shine and frizz control.',
                'description' => 'A lightweight, non-greasy elixir that seals hair cuticles, tames flyaways, and shields locks from environmental styling damage. Infused with vitamin E, argan oil, and organic rosehip oil.',
                'price' => 449.00,
                'compare_price' => 599.00,
                'stock' => 80,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/hair-serum.png',
            ],
            [
                'category_slug' => 'hair-care',
                'name' => 'Hair Care Gift Kit',
                'sku' => 'HC-KIT-GIFT',
                'short_description' => 'The ultimate collection of botanical hair restoration shampoo bars & serum.',
                'description' => 'A curated selection of our best-selling hair products. Includes the Hibiscus Repair Shampoo Bar, Nourishing Shampoo Bar, and Anti-Frizz Hair Serum packed in a reusable premium cotton drawstring bag.',
                'price' => 1199.00,
                'compare_price' => 1466.00,
                'stock' => 20,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/hair-kit.png',
            ],

            // --- Body Care ---
            [
                'category_slug' => 'body-care',
                'name' => 'Nourishing Body Wash',
                'sku' => 'BC-BW-NOUR',
                'short_description' => 'Sulfate-free liquid body wash with Oatmeal & Chamomile extract.',
                'description' => 'A gentle, organic lathering body wash that cleanses sensitive skin without dehydration. Soothing colloidal oatmeal and Roman chamomile extract leave skin silky, calm, and lightly scented.',
                'price' => 299.00,
                'compare_price' => 399.00,
                'stock' => 55,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/body-wash.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Moisturizing Body Lotion',
                'sku' => 'BC-LO-MOIS',
                'short_description' => 'Lightweight hydration with Aloe Vera, Almond Oil & Calendula.',
                'description' => 'An airy, fast-absorbing body lotion that hydrates all day. Formulated with fresh aloe juice, sweet almond oil, and calendula extract to lock in moisture and leave a velvety finish.',
                'price' => 319.00,
                'compare_price' => 420.00,
                'stock' => 60,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/body-lotion.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Rich Body Butter',
                'sku' => 'BC-BT-RICH',
                'short_description' => 'Ultra-nourishing Cocoa & Mango whipped butter for dry skin.',
                'description' => 'Deeply restore dehydrated winter skin with our whipped cocoa and mango butter blend. Melts on contact, nourishing rough elbows, knees, and dry patches with luxurious essential fatty acids.',
                'price' => 349.00,
                'compare_price' => 499.00,
                'stock' => 30,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/body-butter.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Botanical Body Oil',
                'sku' => 'BC-OL-BOTA',
                'short_description' => 'Sensorial body oil infused with Lavender & Cold-Pressed Jojoba.',
                'description' => 'A decadent post-shower glow oil. Locks in deep moisture, hydrates dry skin, and leaves a premium satin sheen with the calming botanical scent of lavender and neroli.',
                'price' => 489.00,
                'compare_price' => 650.00,
                'stock' => 45,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/body-oil.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Sugar Body Scrub',
                'sku' => 'BC-SC-SUGA',
                'short_description' => 'Exfoliating Brown Sugar, Vanilla & Honey polish bar.',
                'description' => 'Buff away dry skin cells with raw brown sugar grains. Suspended in organic honey, vanilla extract, and jojoba oil to nourish new skin layers, leaving you polished, smooth, and glowing.',
                'price' => 329.00,
                'compare_price' => 450.00,
                'stock' => 50,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/sugar-scrub.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Salt Body Scrub',
                'sku' => 'BC-SC-SALT',
                'short_description' => 'Mineral-rich Himalayan Pink Salt, Grapefruit & Rosemary scrub.',
                'description' => 'Energizing and detoxifying pink salt scrub. Mineral-rich salts exfoliate deeply while cold-pressed grapefruit oil and fresh rosemary essential oils stimulate lymphatic drainage and tone skin.',
                'price' => 339.00,
                'compare_price' => 450.00,
                'stock' => 35,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/salt-scrub.png',
            ],
            [
                'category_slug' => 'body-care',
                'name' => 'Body Care Gift Kit',
                'sku' => 'BC-KIT-GIFT',
                'short_description' => 'The ultimate collection of botanical body washes, rich butter & sugar scrub.',
                'description' => 'Bring the luxury spa experience home. This kit includes the Rich Body Butter, Sugar Body Scrub, and Nourishing Body Wash, packaged inside a handcrafted sustainable wooden storage tray.',
                'price' => 1199.00,
                'compare_price' => 1466.00,
                'stock' => 15,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/body-kit.png',
            ],

            // --- Home & Living ---
            [
                'category_slug' => 'home-living',
                'name' => 'Soy Candle',
                'sku' => 'HL-CN-SOY',
                'short_description' => 'Hand-poured soy wax candle with Sandalwood & Amber essential oils.',
                'description' => 'Eco-friendly, soot-free soy wax candle with a crackling wooden wick. Creates a warm, bohemian atmosphere with rich earth notes of royal sandalwood, amber, and vetiver.',
                'price' => 349.00,
                'compare_price' => 499.00,
                'stock' => 70,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/soy-candle.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Reed Diffuser',
                'sku' => 'HL-DF-REED',
                'short_description' => 'Natural rattan reed diffuser with Lemongrass & Sage.',
                'description' => 'Infuse your living space with continuous, flame-free aromatherapy. High-quality essential oil blend of fresh lemongrass, white sage, and eucalyptus disperses beautifully via natural rattan reeds.',
                'price' => 339.00,
                'compare_price' => 450.00,
                'stock' => 40,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/reed-diffuser.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Room & Linen Mist',
                'sku' => 'HL-MT-LINE',
                'short_description' => 'Sensory room spray with French Lavender, Cedarwood & Bergamot.',
                'description' => 'Spritz on pillows, sheets, curtains, or into the air to instantly refresh fabrics. Free from synthetic chemicals, utilizing organic lavender hydrosol and calming cedarwood to aid sleep.',
                'price' => 279.00,
                'compare_price' => 380.00,
                'stock' => 85,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/linen-mist.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Wax Melts',
                'sku' => 'HL-WX-MELT',
                'short_description' => 'Aromatic botanical soy wax melts in Orange Blossom & Cedar.',
                'description' => 'Scented soy wax cubes studded with dried botanicals. Drop a cube into any wax warmer to release notes of blooming orange blossoms, sweet jasmine, and ground cedarwood.',
                'price' => 249.00,
                'compare_price' => 350.00,
                'stock' => 100,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/wax-melts.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Ceramic Incense Holder',
                'sku' => 'HL-AC-CERA',
                'short_description' => 'Handmade ceramic incense tray with a wabi-sabi minimalist aesthetic.',
                'description' => 'Clay incense burner individually hand-pressed and glazed by local artisans. Elegant wabi-sabi shape catches all ash falls and accommodates standard sticks and cones.',
                'price' => 299.00,
                'compare_price' => 450.00,
                'stock' => 30,
                'best_seller' => false,
                'featured' => false,
                'new_arrival' => true,
                'image_path' => '/home/products/incense-holder.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Essential Oil Blend',
                'sku' => 'HL-EO-BLND',
                'short_description' => 'Calming diffuser blend of Jasmine, Ylang-Ylang & Sweet Orange.',
                'description' => 'An aromatherapeutic essential oil concentrate. Dilute in your home mist diffusers to soothe nervous tension, clear headspace, and invite a light, floral, uplifting vibe.',
                'price' => 429.00,
                'compare_price' => 599.00,
                'stock' => 50,
                'best_seller' => true,
                'featured' => false,
                'new_arrival' => false,
                'image_path' => '/home/products/essential-oil.png',
            ],
            [
                'category_slug' => 'home-living',
                'name' => 'Home & Living Gift Kit',
                'sku' => 'HL-KIT-GIFT',
                'short_description' => 'The ultimate sensory kit: Soy Candle, Linen Mist & Incense holder.',
                'description' => 'A beautiful bohemian package for gifting or self-care. Contains the signature Soy Candle, Room & Linen Mist, and the handmade Ceramic Incense Holder nestled in our linen wrapper bag.',
                'price' => 1199.00,
                'compare_price' => 1466.00,
                'stock' => 25,
                'best_seller' => false,
                'featured' => true,
                'new_arrival' => false,
                'image_path' => '/home/products/home-kit.png',
            ]
        ];

        // 3. Create Products and Link Images
        foreach ($productsData as $prod) {
            $category = $categoryModels[$prod['category_slug']];

            $product = Product::updateOrCreate(
                ['sku' => $prod['sku']],
                [
                    'category_id' => $category->id,
                    'name' => $prod['name'],
                    'slug' => Str::slug($prod['name']),
                    'short_description' => $prod['short_description'],
                    'description' => $prod['description'],
                    'price' => $prod['price'],
                    'discount_price' => $prod['compare_price'] ?? null,
                    'stock' => 500,
                    'featured' => $prod['featured'],
                    'is_featured' => $prod['featured'],
                    'is_best_seller' => $prod['best_seller'],
                    'is_new_arrival' => $prod['new_arrival'],
                    'is_active' => true,
                    'low_stock_threshold' => 5,
                    'gst_percentage' => 18,
                    'brand' => 'Meraki House',
                ]
            );

            // Create Primary Product Image
            ProductImage::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'is_primary' => true
                ],
                [
                    'path' => $prod['image_path'],
                    'type' => 'image',
                    'mime_type' => 'image/png',
                    'alt_text' => $prod['name'] . ' Primary Image',
                    'sort_order' => 1,
                ]
            );
        }
    }
}
