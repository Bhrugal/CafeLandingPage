/**
 * ==========================================================================
 * BREW HAVEN CAFE - MAIN INTERACTIVE LOGIC
 * ==========================================================================
 */

// Initialize Animate On Scroll
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }

  initApp();
});

/* ==========================================================================
   APP STATE & DATA
   ========================================================================== */

const MENU_ITEMS = [
  {
    id: 1,
    name: "Hazelnut Velvet Flat White",
    category: "coffee",
    price: 5.80,
    oldPrice: 6.80,
    tag: "Chef's Choice",
    rating: 4.9,
    calories: "160 kcal",
    diet: ["Signature", "Oat Option"],
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    description: "Double ristretto infused with roasted Oregon hazelnut extract, velvety micro-foamed milk, and raw cane sugar."
  },
  {
    id: 2,
    name: "Ethiopian Yirgacheffe Pour-Over",
    category: "coffee",
    price: 6.50,
    oldPrice: null,
    tag: "Single Origin",
    rating: 5.0,
    calories: "5 kcal",
    diet: ["Direct Trade", "Filter"],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    description: "Light roast with delicate floral jasmine aromas, bright bergamot acidity, and a silky honeycomb lingering finish."
  },
  {
    id: 3,
    name: "Spanish Honey Cortado",
    category: "coffee",
    price: 5.20,
    oldPrice: null,
    tag: "Best Seller",
    rating: 4.8,
    calories: "120 kcal",
    diet: ["1:1 Ratio", "Organic"],
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    description: "Equal parts intense double espresso and warm steamed whole milk, layered with wild Tasmanian honey and cinnamon."
  },
  {
    id: 4,
    name: "Caramel Brûlée Latte",
    category: "coffee",
    price: 6.20,
    oldPrice: 7.00,
    tag: "Popular",
    rating: 4.9,
    calories: "210 kcal",
    diet: ["Sweet", "Torched Sugar"],
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=80",
    description: "Rich espresso combined with salted caramel cream, topped with a crisp blowtorched turbinado sugar crust."
  },
  {
    id: 5,
    name: "24h Nitro Cascara Cold Brew",
    category: "coldbrew",
    price: 6.80,
    oldPrice: null,
    tag: "Award Winner",
    rating: 5.0,
    calories: "10 kcal",
    diet: ["Nitro Infused", "Super Clean"],
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    description: "Steeped cold for 24 hours and infused with food-grade nitrogen for a creamy stout-like head and natural fruit sweetness."
  },
  {
    id: 6,
    name: "Iced Ceremonial Pistachio Matcha",
    category: "coldbrew",
    price: 7.20,
    oldPrice: null,
    tag: "New",
    rating: 4.8,
    calories: "180 kcal",
    diet: ["Uji Grade", "Vegan"],
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    description: "First-harvest Kyoto Uji matcha layered over artisan pistachio cream milk and poured over crystal-clear ice blocks."
  },
  {
    id: 7,
    name: "Vanilla Sweet Cream Cold Foam",
    category: "coldbrew",
    price: 6.50,
    oldPrice: null,
    tag: "Trending",
    rating: 4.9,
    calories: "140 kcal",
    diet: ["Iced", "House Cream"],
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
    description: "Slow-steeped Colombian cold brew topped with thick, cloud-like Madagascar vanilla sweet cream foam."
  },
  {
    id: 8,
    name: "72-Layer Parisian Butter Croissant",
    category: "bakery",
    price: 4.90,
    oldPrice: null,
    tag: "Daily Fresh",
    rating: 5.0,
    calories: "280 kcal",
    diet: ["French Butter", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    description: "Laminated with PDO Normandy butter, featuring a golden shatteringly crisp crust and an airy honeycomb interior."
  },
  {
    id: 9,
    name: "Pistachio Raspberry Cruffin",
    category: "bakery",
    price: 6.40,
    oldPrice: null,
    tag: "Must Try",
    rating: 4.9,
    calories: "340 kcal",
    diet: ["Filled", "Artisan"],
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    description: "Croissant-muffin hybrid rolled in vanilla sugar, piped with Bronte pistachio custard and wild raspberry coulis."
  },
  {
    id: 10,
    name: "San Sebastián Burnt Cheesecake",
    category: "bakery",
    price: 7.50,
    oldPrice: 8.50,
    tag: "Best Seller",
    rating: 5.0,
    calories: "390 kcal",
    diet: ["Gluten-Free Friendly"],
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    description: "Caramelized dark exterior with an ultra-creamy, molten vanilla-bean center. Baked fresh in small batches."
  },
  {
    id: 11,
    name: "Truffled Wild Mushroom Sourdough",
    category: "breakfast",
    price: 15.80,
    oldPrice: null,
    tag: "Chef's Brunch",
    rating: 4.9,
    calories: "450 kcal",
    diet: ["Savory", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    description: "Sautéed king brown & oyster mushrooms over toasted seeded sourdough, thyme-whipped ricotta, and black truffle oil."
  },
  {
    id: 12,
    name: "Smoked Salmon Brioche Benedict",
    category: "breakfast",
    price: 17.50,
    oldPrice: 19.00,
    tag: "Signature",
    rating: 4.9,
    calories: "520 kcal",
    diet: ["High Protein", "Organic Eggs"],
    image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80",
    description: "Toasted brioche, Tasmanian cold-smoked salmon, organic poached eggs, yuzu hollandaise, and crispy fried capers."
  }
];

const BREW_DETAILS = {
  espresso: {
    title: "Signature Double Ristretto Espresso",
    desc: "Pulled through our custom Synesso MVP machine at 93.5°C under 9-bar pressure. Delivers a dense tiger-striped crema with notes of caramelized walnut and dark cacao.",
    time: "27 - 30s",
    temp: "93.5°C",
    roast: "Medium-Dark"
  },
  pourover: {
    title: "Hario V60 Single-Origin Drip",
    desc: "Hand-poured with a 1:16 ratio using 92°C mineral-balanced water. Reveals floral jasmine, crisp green apple, and honeysuckle notes with high clarity.",
    time: "3m 15s",
    temp: "92.0°C",
    roast: "Light-Medium"
  },
  coldbrew: {
    title: "24-Hour Nitro Cascara Brew",
    desc: "Slow cold-water immersion extraction over 24 hours, followed by double filtration and pressurized nitrogen dispensing for a silky velvet mouthfeel.",
    time: "24 Hours",
    temp: "4.0°C",
    roast: "Medium"
  },
  aeropress: {
    title: "Inverted Aeropress Immersion",
    desc: "Total immersion brew with high extraction yield and zero bitterness. Yields a full, rich body with rounded milk chocolate and hazelnut finish.",
    time: "2m 00s",
    temp: "88.0°C",
    roast: "Medium"
  }
};

let cart = JSON.parse(localStorage.getItem('brew_haven_cart')) || [];
let activeCoupon = localStorage.getItem('brew_haven_coupon') || null;
let currentCustomizingItem = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

function initApp() {
  renderMenu('all');
  initFilterControls();
  initSearch();
  initCart();
  initThemeToggle();
  initStoryTabs();
  initReservationForm();
  initCheckoutForm();
  initNewsletterForm();
  initGalleryModal();
  initLiveHours();
  initScrollNav();
  initDailySpecial();
  
  // Set default min date for reservation to today
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    const today = new Date().toISOString().split('T')[0];
    resDateInput.min = today;
    resDateInput.value = today;
  }
}

/* ==========================================================================
   MENU RENDERING & FILTERING
   ========================================================================== */

function renderMenu(filterCategory = 'all', searchQuery = '') {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;

  const query = searchQuery.trim().toLowerCase();
  
  const filtered = MENU_ITEMS.filter(item => {
    const matchesCategory = (filterCategory === 'all' || item.category === filterCategory);
    const matchesSearch = query === '' || 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.diet.some(d => d.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    menuGrid.innerHTML = `
      <div class="menu-empty-state" data-aos="fade-up">
        <i class="fa-solid fa-mug-hot fs-1 text-muted mb-3 d-block"></i>
        <h4 class="fw-bold">No Items Found</h4>
        <p class="text-secondary">Try searching for something else or explore all menu categories.</p>
        <button class="btn-luxury-outline mt-2" onclick="resetMenuFilters()">Reset Filter</button>
      </div>
    `;
    return;
  }

  menuGrid.innerHTML = filtered.map(item => `
    <div class="col-lg-4 col-md-6" data-aos="fade-up">
      <div class="menu-card">
        <div class="menu-img-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.tag ? `<span class="badge-tag badge-gold menu-badge-top">${item.tag}</span>` : ''}
          <button class="menu-quick-view-btn" onclick="openQuickView(${item.id})" title="Quick Customize">
            <i class="fa-solid fa-sliders"></i>
          </button>
        </div>
        <div class="menu-body">
          <div class="menu-meta">
            <div class="menu-rating">
              <i class="fa-solid fa-star"></i>
              <span>${item.rating.toFixed(1)}</span>
            </div>
            <span class="menu-calories">${item.calories}</span>
          </div>

          <h4 class="menu-title">${item.name}</h4>
          <p class="menu-desc">${item.description}</p>

          <div class="menu-tags-row">
            ${item.diet.map(d => `<span class="menu-diet-tag">${d}</span>`).join('')}
          </div>

          <div class="menu-footer">
            <div>
              <span class="menu-price">$${item.price.toFixed(2)}</span>
              ${item.oldPrice ? `<span class="menu-old-price">$${item.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="btn-add-cart-card" onclick="quickAddToCart(${item.id})" title="Add to Order">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function initFilterControls() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;
      const searchInput = document.getElementById('menuSearchInput');
      renderMenu(category, searchInput ? searchInput.value : '');
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('menuSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn ? activeBtn.dataset.filter : 'all';
    renderMenu(category, e.target.value);
  });
}

window.resetMenuFilters = function() {
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) searchInput.value = '';
  
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) allBtn.classList.add('active');
  
  renderMenu('all', '');
};

/* ==========================================================================
   QUICK VIEW / ITEM CUSTOMIZER MODAL
   ========================================================================== */

window.openQuickView = function(itemId) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  currentCustomizingItem = {
    ...item,
    selectedSize: 'Regular',
    selectedMilk: 'Whole Milk',
    selectedSweetness: '100% Sweet',
    extraShot: false,
    calculatedPrice: item.price
  };

  const modalTitle = document.getElementById('quickViewModalTitle');
  const modalBody = document.getElementById('quickViewBody');
  
  if (modalTitle) modalTitle.textContent = item.name;

  if (modalBody) {
    modalBody.innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-sm-5">
          <img src="${item.image}" alt="${item.name}" class="rounded-3 w-100 object-fit-cover shadow" style="height: 180px;">
        </div>
        <div class="col-sm-7">
          <div class="d-flex align-items-center gap-2 mb-1">
            <div class="text-warning small"><i class="fa-solid fa-star"></i> ${item.rating.toFixed(1)}</div>
            <span class="text-muted small">• ${item.calories}</span>
          </div>
          <p class="small text-secondary mb-2">${item.description}</p>
          <div class="h4 font-serif text-warning fw-bold mb-0" id="customizerLivePrice">$${item.price.toFixed(2)}</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Cup Size</label>
        <div class="custom-radio-group">
          <div class="custom-radio-btn">
            <input type="radio" name="optSize" id="sizeSmall" value="Small" data-add="0">
            <label for="sizeSmall">Small (8oz)</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optSize" id="sizeReg" value="Regular" data-add="0.50" checked>
            <label for="sizeReg">Regular (12oz) +$0.50</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optSize" id="sizeLrg" value="Large" data-add="1.00">
            <label for="sizeLrg">Large (16oz) +$1.00</label>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Milk / Base Preference</label>
        <div class="custom-radio-group">
          <div class="custom-radio-btn">
            <input type="radio" name="optMilk" id="milkW" value="Whole Milk" data-add="0" checked>
            <label for="milkW">Whole Milk</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optMilk" id="milkOat" value="Oat Milk" data-add="0.70">
            <label for="milkOat">Oat Milk +$0.70</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optMilk" id="milkAlm" value="Almond Milk" data-add="0.70">
            <label for="milkAlm">Almond +$0.70</label>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Sweetness Level</label>
        <div class="custom-radio-group">
          <div class="custom-radio-btn">
            <input type="radio" name="optSweet" id="sweet0" value="0% Unsweetened">
            <label for="sweet0">0%</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optSweet" id="sweet50" value="50% Less Sweet">
            <label for="sweet50">50%</label>
          </div>
          <div class="custom-radio-btn">
            <input type="radio" name="optSweet" id="sweet100" value="100% Standard" checked>
            <label for="sweet100">100%</label>
          </div>
        </div>
      </div>

      <div class="form-check form-switch mt-3">
        <input class="form-check-input" type="checkbox" id="extraShotCheck" style="cursor: pointer;">
        <label class="form-check-label small fw-bold" for="extraShotCheck" style="cursor: pointer;">
          Extra Organic Espresso Shot (+$0.80)
        </label>
      </div>
    `;

    // Attach listeners for dynamic price updating inside modal
    modalBody.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', updateCustomizerPrice);
    });
  }

  updateCustomizerPrice();

  const modalEl = document.getElementById('quickViewModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
};

function updateCustomizerPrice() {
  if (!currentCustomizingItem) return;

  let basePrice = currentCustomizingItem.price;

  const sizeRadio = document.querySelector('input[name="optSize"]:checked');
  if (sizeRadio) {
    currentCustomizingItem.selectedSize = sizeRadio.value;
    basePrice += parseFloat(sizeRadio.dataset.add || 0);
  }

  const milkRadio = document.querySelector('input[name="optMilk"]:checked');
  if (milkRadio) {
    currentCustomizingItem.selectedMilk = milkRadio.value;
    basePrice += parseFloat(milkRadio.dataset.add || 0);
  }

  const sweetRadio = document.querySelector('input[name="optSweet"]:checked');
  if (sweetRadio) {
    currentCustomizingItem.selectedSweetness = sweetRadio.value;
  }

  const extraShot = document.getElementById('extraShotCheck');
  if (extraShot && extraShot.checked) {
    currentCustomizingItem.extraShot = true;
    basePrice += 0.80;
  } else {
    currentCustomizingItem.extraShot = false;
  }

  currentCustomizingItem.calculatedPrice = basePrice;
  const priceDisplay = document.getElementById('customizerLivePrice');
  if (priceDisplay) priceDisplay.textContent = `$${basePrice.toFixed(2)}`;
}

// Add customized item to cart
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'modalAddToCartBtn') {
    if (!currentCustomizingItem) return;

    const customKey = `${currentCustomizingItem.id}-${currentCustomizingItem.selectedSize}-${currentCustomizingItem.selectedMilk}-${currentCustomizingItem.extraShot}`;
    
    const existingIndex = cart.findIndex(i => i.customKey === customKey);

    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: currentCustomizingItem.id,
        customKey: customKey,
        name: currentCustomizingItem.name,
        price: currentCustomizingItem.calculatedPrice,
        image: currentCustomizingItem.image,
        details: `${currentCustomizingItem.selectedSize} • ${currentCustomizingItem.selectedMilk}${currentCustomizingItem.extraShot ? ' • +Extra Shot' : ''}`,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    showToast(`Added ${currentCustomizingItem.name} to order!`, 'success');

    // Close modal
    const modalEl = document.getElementById('quickViewModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    openCartDrawer();
  }
});

/* ==========================================================================
   CART OPERATIONS & SLIDE-OUT DRAWER
   ========================================================================= */

window.quickAddToCart = function(itemId) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  const customKey = `${item.id}-Regular-Standard-false`;
  const existing = cart.find(i => i.customKey === customKey);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: item.id,
      customKey: customKey,
      name: item.name,
      price: item.price,
      image: item.image,
      details: 'Regular • Standard',
      qty: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`Added ${item.name} to cart!`, 'success');
  openCartDrawer();
};

function saveCart() {
  localStorage.setItem('brew_haven_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const countBadge = document.getElementById('cartCountBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (countBadge) countBadge.textContent = totalCount;
  if (drawerCount) drawerCount.textContent = totalCount;
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const footerEl = document.getElementById('cartDrawerFooter');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">☕</div>
        <h5 class="fw-bold mb-2">Your Order is Empty</h5>
        <p class="text-secondary small mb-4">Add your favorite freshly roasted coffee or pastries to begin.</p>
        <button class="btn-luxury-gold py-2 px-4" onclick="closeCartDrawer(); window.location.href='#menu';">
          Browse Menu
        </button>
      </div>
    `;
    if (footerEl) footerEl.style.opacity = '0.5';
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (taxEl) taxEl.textContent = '$0.00';
    if (totalEl) totalEl.textContent = '$0.00';
    if (discountRow) discountRow.classList.add('d-none');
    return;
  }

  if (footerEl) footerEl.style.opacity = '1';

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-custom">${item.details}</div>
        <div class="cart-item-bottom">
          <div class="cart-qty-ctrl">
            <button class="btn-qty" onclick="changeItemQty(${idx}, -1)" title="Decrease Quantity">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="btn-qty" onclick="changeItemQty(${idx}, 1)" title="Increase Quantity">+</button>
          </div>
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          <button class="btn-remove-item" onclick="removeCartItem(${idx})" title="Remove">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;

  if (activeCoupon === 'HAVEN10') {
    discount = subtotal * 0.10;
    if (discountRow) discountRow.classList.remove('d-none');
    if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    if (discountRow) discountRow.classList.add('d-none');
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.05;
  const grandTotal = taxableAmount + tax;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

window.changeItemQty = function(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
};

window.removeCartItem = function(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showToast('Item removed from cart', 'info');
};

function initCart() {
  updateCartBadge();
  renderCart();

  const openBtn = document.getElementById('openCartBtn');
  const closeBtn = document.getElementById('closeCartBtn');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('cartCouponInput');
  const proceedBtn = document.getElementById('proceedCheckoutBtn');

  if (openBtn) openBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);

  if (applyCouponBtn && couponInput) {
    if (activeCoupon) couponInput.value = activeCoupon;

    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === 'HAVEN10') {
        activeCoupon = 'HAVEN10';
        localStorage.setItem('brew_haven_coupon', 'HAVEN10');
        renderCart();
        showToast('Promo code HAVEN10 applied! 10% discount added.', 'success');
      } else if (code === '') {
        activeCoupon = null;
        localStorage.removeItem('brew_haven_coupon');
        renderCart();
      } else {
        showToast('Invalid promo code. Use HAVEN10', 'info');
      }
    });
  }

  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your order is empty!', 'info');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (drawer) drawer.classList.add('show');
  if (backdrop) backdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (drawer) drawer.classList.remove('show');
  if (backdrop) backdrop.classList.remove('show');
  document.body.style.overflow = '';
};

/* ==========================================================================
   CHECKOUT FLOW
   ========================================================================= */

function openCheckoutModal() {
  const totalEl = document.getElementById('cartTotal');
  const checkoutTotal = document.getElementById('checkoutOrderTotal');
  if (checkoutTotal && totalEl) {
    checkoutTotal.textContent = totalEl.textContent;
  }

  const modalEl = document.getElementById('checkoutModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('orderCustName').value;
    const phone = document.getElementById('orderCustPhone').value;
    const time = document.getElementById('orderPickupTime').value;
    const pay = document.querySelector('input[name="payOption"]:checked').value;
    const total = document.getElementById('checkoutOrderTotal').textContent;
    const orderId = `BH-${Math.floor(100000 + Math.random() * 900000)}`;

    // Close checkout modal
    const checkoutModalEl = document.getElementById('checkoutModal');
    if (checkoutModalEl && typeof bootstrap !== 'undefined') {
      const modal = bootstrap.Modal.getInstance(checkoutModalEl);
      if (modal) modal.hide();
    }

    // Show Confirmation Modal
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmDetails = document.getElementById('confirmDetails');

    if (confirmTitle) confirmTitle.textContent = "Order Placed Successfully!";
    if (confirmMessage) confirmMessage.textContent = `Thank you, ${name}! Your specialty coffee order has been queued.`;
    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div class="mb-2"><strong>Order ID:</strong> <span class="text-warning">${orderId}</span></div>
        <div class="mb-1"><strong>Pickup Ready:</strong> ${time}</div>
        <div class="mb-1"><strong>Contact Phone:</strong> ${phone}</div>
        <div class="mb-1"><strong>Payment:</strong> ${pay}</div>
        <div class="mt-2 pt-2 border-top border-secondary"><strong>Total Paid:</strong> <span class="text-warning fw-bold">${total}</span></div>
      `;
    }

    // Clear cart
    cart = [];
    saveCart();
    renderCart();

    const confirmModalEl = document.getElementById('confirmationModal');
    if (confirmModalEl && typeof bootstrap !== 'undefined') {
      const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalEl);
      confirmModal.show();
    }
  });
}

/* ==========================================================================
   TABLE RESERVATION FORM
   ========================================================================= */

function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value;
    const email = document.getElementById('resEmail').value;
    const phone = document.getElementById('resPhone').value;
    const guests = document.getElementById('resGuests').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const zone = document.querySelector('input[name="seatingZone"]:checked').value;
    const refCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmDetails = document.getElementById('confirmDetails');

    if (confirmTitle) confirmTitle.textContent = "Table Reserved!";
    if (confirmMessage) confirmMessage.textContent = `We look forward to welcoming you, ${name}!`;
    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div class="mb-2"><strong>Reservation Ref:</strong> <span class="text-warning">${refCode}</span></div>
        <div class="mb-1"><strong>Party Size:</strong> ${guests} Guests</div>
        <div class="mb-1"><strong>Date & Time:</strong> ${date} at ${time}</div>
        <div class="mb-1"><strong>Seating Area:</strong> ${zone}</div>
        <div class="mb-1"><strong>Confirmation Sent To:</strong> ${email}</div>
        <div class="mt-2 small text-secondary">A reminder SMS will be sent to ${phone} 1 hour prior.</div>
      `;
    }

    form.reset();

    const confirmModalEl = document.getElementById('confirmationModal');
    if (confirmModalEl && typeof bootstrap !== 'undefined') {
      const confirmModal = bootstrap.Modal.getOrCreateInstance(confirmModalEl);
      confirmModal.show();
    }
  });
}

/* ==========================================================================
   BREWING STORY TABS
   ========================================================================= */

function initStoryTabs() {
  const tabBtns = document.querySelectorAll('.brew-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.dataset.tab;
      const data = BREW_DETAILS[tabKey];
      if (!data) return;

      const title = document.getElementById('brewTabTitle');
      const desc = document.getElementById('brewTabDesc');
      const time = document.getElementById('brewTabTime');
      const temp = document.getElementById('brewTabTemp');
      const roast = document.getElementById('brewTabRoast');

      if (title) title.textContent = data.title;
      if (desc) desc.textContent = data.desc;
      if (time) time.textContent = data.time;
      if (temp) temp.textContent = data.temp;
      if (roast) roast.textContent = data.roast;
    });
  });
}

/* ==========================================================================
   DAILY SPECIAL & PROMO
   ========================================================================= */

function initDailySpecial() {
  const copyBtn = document.getElementById('copyCouponBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('couponCodeText').textContent;
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Copied promo code ${code}! Apply it at checkout.`, 'success');
      });
    });
  }

  const quickAddBtn = document.getElementById('quickAddSpecialBtn');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      quickAddToCart(1);
    });
  }
}

/* ==========================================================================
   NEWSLETTER FORM
   ========================================================================= */

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    showToast(`Welcome to the Haven Club! Free croissant voucher sent to ${email}`, 'success');
    form.reset();
  });
}

/* ==========================================================================
   GALLERY LIGHTBOX
   ========================================================================= */

function initGalleryModal() {
  const items = document.querySelectorAll('.gallery-item');
  const modalImg = document.getElementById('galleryModalImg');
  const galleryModalEl = document.getElementById('galleryModal');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.dataset.img;
      if (modalImg && imgSrc) {
        modalImg.src = imgSrc;
      }
      if (galleryModalEl && typeof bootstrap !== 'undefined') {
        const modal = bootstrap.Modal.getOrCreateInstance(galleryModalEl);
        modal.show();
      }
    });
  });
}

/* ==========================================================================
   LIVE OPERATING HOURS INDICATOR
   ========================================================================= */

function initLiveHours() {
  const statusPill = document.getElementById('liveStatusPill');
  const statusText = document.getElementById('liveStatusText');
  if (!statusPill || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  const hour = now.getHours();

  let isOpen = false;
  let closeTime = "7:00 PM";

  if (day >= 1 && day <= 5) {
    // Weekday: 7 AM to 7 PM (19:00)
    isOpen = (hour >= 7 && hour < 19);
    closeTime = "7:00 PM";
  } else {
    // Weekend: 8 AM to 6 PM (18:00)
    isOpen = (hour >= 8 && hour < 18);
    closeTime = "6:00 PM";
  }

  if (isOpen) {
    statusPill.className = "status-indicator-pill open";
    statusText.textContent = `Open Now • Closes at ${closeTime}`;
  } else {
    statusPill.className = "status-indicator-pill closed";
    statusText.textContent = `Currently Closed • Opens at 7:00 AM`;
  }
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================= */

function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!toggleBtn || !icon) return;

  const savedTheme = localStorage.getItem('brew_haven_theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    icon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-theme');
    icon.className = 'fa-solid fa-moon';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('brew_haven_theme', isLight ? 'light' : 'dark');
    icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    showToast(`Switched to ${isLight ? 'Light' : 'Dark'} Mode`, 'info');
  });
}

/* ==========================================================================
   SCROLL EFFECTS, NAVBAR & BACK TO TOP
   ========================================================================= */

function initScrollNav() {
  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-links-wrap .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar Scrolled Effect
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to Top Button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Active Section Highlighter
    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Close mobile navbar on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navCollapse = document.getElementById('navbarMenu');
      if (navCollapse && navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================= */

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-custom ${type}`;
  
  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check text-success';
  if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation text-danger';

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}