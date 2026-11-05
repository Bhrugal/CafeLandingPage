let lastDashboardTab = "orders";
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
let currentDiningType = localStorage.getItem('brew_haven_dining') || 'takeaway';
let modalSelectedQty = 1;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

function initApp() {
  renderMenu('all');
  initFilterControls();
  initSearch();
  initCart();
  initFloatingCart();
  initThemeToggle();
  initStoryTabs();
  initReservationForm();
  initCheckoutForm();
  initNewsletterForm();
  initLiveOrdersModal();
  initGalleryModal();
  initLiveHours();
  initScrollNav();
  initDailySpecial();
  initHavenWalletSystem();
  
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
            <button class="btn-add-cart-card" onclick="quickAddToCart(${item.id}, event)" title="Add to Order">
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
   FLY TO CART ANIMATION & BADGE FEEDBACK
   ========================================================================== */

function triggerFlyToCart(sourceElement) {
  if (!sourceElement) return;
  const targetEl = document.getElementById('openCartBtn');
  if (!targetEl) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  const clone = document.createElement('img');
  if (sourceElement.tagName && sourceElement.tagName.toLowerCase() === 'img') {
    clone.src = sourceElement.src;
  } else {
    const innerImg = sourceElement.querySelector ? sourceElement.querySelector('img') : null;
    clone.src = innerImg ? innerImg.src : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80';
  }
  clone.className = 'flying-cart-clone';
  clone.style.left = `${sourceRect.left + sourceRect.width / 2 - 24}px`;
  clone.style.top = `${sourceRect.top + sourceRect.height / 2 - 24}px`;
  clone.style.width = '48px';
  clone.style.height = '48px';
  clone.style.opacity = '1';

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.left = `${targetRect.left + targetRect.width / 2 - 12}px`;
    clone.style.top = `${targetRect.top + targetRect.height / 2 - 12}px`;
    clone.style.width = '24px';
    clone.style.height = '24px';
    clone.style.opacity = '0.2';
    clone.style.transform = 'scale(0.4) rotate(180deg)';
  });

  setTimeout(() => {
    clone.remove();
    bounceCartBadges();
  }, 750);
}

function bounceCartBadges() {
  const countBadge = document.getElementById('cartCountBadge');
  const floatingBadge = document.getElementById('floatingCartCount');
  [countBadge, floatingBadge].forEach(b => {
    if (b) {
      b.classList.remove('bounce');
      void b.offsetWidth; // trigger reflow
      b.classList.add('bounce');
    }
  });
}

/* ==========================================================================
   QUICK VIEW / ITEM CUSTOMIZER MODAL
   ========================================================================== */

window.openQuickView = function(itemId) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  modalSelectedQty = 1;
  const qtyValEl = document.getElementById('modalQtyVal');
  if (qtyValEl) qtyValEl.textContent = '1';

  currentCustomizingItem = {
    ...item,
    baseItemPrice: item.price,
    selectedSize: 'Regular',
    selectedMilk: 'Whole Milk',
    selectedSweetness: '100% Standard',
    selectedTemp: 'Hot / Standard',
    extraShot: false,
    bakeryServing: 'Warm & Freshly Toasted',
    bakerySpread: 'Organic French Butter',
    breakfastBread: 'Artisan Sourdough',
    breakfastEgg: true,
    breakfastAvo: false,
    specialNotes: '',
    calculatedPrice: item.price
  };

  const modalTitle = document.getElementById('quickViewModalTitle');
  const modalBody = document.getElementById('quickViewBody');
  if (modalTitle) modalTitle.textContent = item.name;

  if (modalBody) {
    let customOptionsHtml = '';

    if (item.category === 'bakery') {
      customOptionsHtml = `
        <div class="mb-3">
          <label class="form-label">Serving Style</label>
          <div class="custom-radio-group">
            <div class="custom-radio-btn">
              <input type="radio" name="optBakeryServing" id="serveWarm" value="Warm & Freshly Toasted" data-add="0" checked>
              <label for="serveWarm"><i class="fa-solid fa-fire me-1 text-warning"></i> Warm & Toasted</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optBakeryServing" id="serveRoom" value="Fresh at Room Temp" data-add="0">
              <label for="serveRoom"><i class="fa-solid fa-sun me-1"></i> Fresh at Room Temp</label>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Artisan Spreads & Add-on</label>
          <div class="custom-radio-group">
            <div class="custom-radio-btn">
              <input type="radio" name="optBakerySpread" id="spreadButter" value="Organic French Butter & Jam" data-add="0.80" checked>
              <label for="spreadButter">French Butter & Jam +$0.80</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optBakerySpread" id="spreadClotted" value="Devonshire Clotted Cream" data-add="1.20">
              <label for="spreadClotted">Clotted Cream +$1.20</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optBakerySpread" id="spreadNone" value="Plain / No Spread" data-add="0">
              <label for="spreadNone">Plain / None</label>
            </div>
          </div>
        </div>
      `;
    } else if (item.category === 'breakfast') {
      customOptionsHtml = `
        <div class="mb-3">
          <label class="form-label">Artisan Bread Choice</label>
          <div class="custom-radio-group">
            <div class="custom-radio-btn">
              <input type="radio" name="optBread" id="breadSour" value="Artisan Sourdough" data-add="0" checked>
              <label for="breadSour">Sourdough</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optBread" id="breadBrioche" value="French Brioche" data-add="0.50">
              <label for="breadBrioche">Brioche +$0.50</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optBread" id="breadGf" value="Gluten-Free Loaf" data-add="1.00">
              <label for="breadGf">Gluten-Free +$1.00</label>
            </div>
          </div>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-sm-6">
            <div class="form-check form-switch p-2 rounded border" style="background: var(--bg-card); border-color: var(--border-color) !important;">
              <input class="form-check-input ms-0 me-2" type="checkbox" id="breakfastEggCheck" checked style="cursor: pointer;">
              <label class="form-check-label small fw-bold" for="breakfastEggCheck" style="cursor: pointer;">
                Poached Organic Egg (+$1.50)
              </label>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-check form-switch p-2 rounded border" style="background: var(--bg-card); border-color: var(--border-color) !important;">
              <input class="form-check-input ms-0 me-2" type="checkbox" id="breakfastAvoCheck" style="cursor: pointer;">
              <label class="form-check-label small fw-bold" for="breakfastAvoCheck" style="cursor: pointer;">
                Extra Avocado (+$2.00)
              </label>
            </div>
          </div>
        </div>
      `;
    } else {
      // Coffee & Coldbrew
      customOptionsHtml = `
        <div class="mb-3">
          <label class="form-label">Cup Size</label>
          <div class="custom-radio-group">
            <div class="custom-radio-btn">
              <input type="radio" name="optSize" id="sizeSmall" value="Small (8oz)" data-add="0">
              <label for="sizeSmall">Small (8oz)</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optSize" id="sizeReg" value="Regular (12oz)" data-add="0.50" checked>
              <label for="sizeReg">Regular (12oz) +$0.50</label>
            </div>
            <div class="custom-radio-btn">
              <input type="radio" name="optSize" id="sizeLrg" value="Large (16oz)" data-add="1.00">
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

        <div class="row g-2 mb-3">
          <div class="col-sm-6">
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

          <div class="col-sm-6">
            <label class="form-label">Serving Temp</label>
            <div class="custom-radio-group">
              <div class="custom-radio-btn">
                <input type="radio" name="optTemp" id="tempHot" value="Hot / Standard" checked>
                <label for="tempHot">Standard</label>
              </div>
              <div class="custom-radio-btn">
                <input type="radio" name="optTemp" id="tempIced" value="Iced (Chilled)">
                <label for="tempIced">Iced</label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-check form-switch mt-2">
          <input class="form-check-input" type="checkbox" id="extraShotCheck" style="cursor: pointer;">
          <label class="form-check-label small fw-bold" for="extraShotCheck" style="cursor: pointer;">
            Extra Organic Espresso Shot (+$0.80)
          </label>
        </div>
      `;
    }

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

      ${customOptionsHtml}

      <div class="mt-3">
        <label class="form-label small text-secondary">Special Instructions for Barista / Kitchen (Optional)</label>
        <textarea id="modalSpecialNotes" class="modal-notes-input" placeholder="e.g. Extra hot, light foam, cut in half..."></textarea>
      </div>
    `;

    // Attach listeners for dynamic price updating inside modal
    modalBody.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', updateCustomizerPrice);
    });

    const notesEl = document.getElementById('modalSpecialNotes');
    if (notesEl) {
      notesEl.addEventListener('input', (e) => {
        if (currentCustomizingItem) currentCustomizingItem.specialNotes = e.target.value.trim();
      });
    }
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

  let unitPrice = currentCustomizingItem.price;

  // Beverage options
  const sizeRadio = document.querySelector('input[name="optSize"]:checked');
  if (sizeRadio) {
    currentCustomizingItem.selectedSize = sizeRadio.value;
    unitPrice += parseFloat(sizeRadio.dataset.add || 0);
  }

  const milkRadio = document.querySelector('input[name="optMilk"]:checked');
  if (milkRadio) {
    currentCustomizingItem.selectedMilk = milkRadio.value;
    unitPrice += parseFloat(milkRadio.dataset.add || 0);
  }

  const sweetRadio = document.querySelector('input[name="optSweet"]:checked');
  if (sweetRadio) {
    currentCustomizingItem.selectedSweetness = sweetRadio.value;
  }

  const tempRadio = document.querySelector('input[name="optTemp"]:checked');
  if (tempRadio) {
    currentCustomizingItem.selectedTemp = tempRadio.value;
  }

  const extraShot = document.getElementById('extraShotCheck');
  if (extraShot && extraShot.checked) {
    currentCustomizingItem.extraShot = true;
    unitPrice += 0.80;
  } else {
    currentCustomizingItem.extraShot = false;
  }

  // Bakery options
  const bakeryServing = document.querySelector('input[name="optBakeryServing"]:checked');
  if (bakeryServing) {
    currentCustomizingItem.bakeryServing = bakeryServing.value;
  }
  const bakerySpread = document.querySelector('input[name="optBakerySpread"]:checked');
  if (bakerySpread) {
    currentCustomizingItem.bakerySpread = bakerySpread.value;
    unitPrice += parseFloat(bakerySpread.dataset.add || 0);
  }

  // Breakfast options
  const breadRadio = document.querySelector('input[name="optBread"]:checked');
  if (breadRadio) {
    currentCustomizingItem.breakfastBread = breadRadio.value;
    unitPrice += parseFloat(breadRadio.dataset.add || 0);
  }
  const eggCheck = document.getElementById('breakfastEggCheck');
  if (eggCheck && eggCheck.checked) {
    currentCustomizingItem.breakfastEgg = true;
    unitPrice += 1.50;
  } else {
    currentCustomizingItem.breakfastEgg = false;
  }
  const avoCheck = document.getElementById('breakfastAvoCheck');
  if (avoCheck && avoCheck.checked) {
    currentCustomizingItem.breakfastAvo = true;
    unitPrice += 2.00;
  } else {
    currentCustomizingItem.breakfastAvo = false;
  }

  currentCustomizingItem.calculatedPrice = unitPrice;

  const priceDisplay = document.getElementById('customizerLivePrice');
  if (priceDisplay) priceDisplay.textContent = `$${unitPrice.toFixed(2)}`;

  const addBtnLabel = document.getElementById('modalAddBtnLabel');
  if (addBtnLabel) {
    const totalOrderCost = unitPrice * modalSelectedQty;
    addBtnLabel.textContent = `Add to Order — $${totalOrderCost.toFixed(2)}`;
  }
}

// Modal Quantity Stepper Listeners
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'modalQtyDec') {
    if (modalSelectedQty > 1) {
      modalSelectedQty -= 1;
      const valEl = document.getElementById('modalQtyVal');
      if (valEl) valEl.textContent = modalSelectedQty;
      updateCustomizerPrice();
    }
  }

  if (e.target && e.target.id === 'modalQtyInc') {
    if (modalSelectedQty < 20) {
      modalSelectedQty += 1;
      const valEl = document.getElementById('modalQtyVal');
      if (valEl) valEl.textContent = modalSelectedQty;
      updateCustomizerPrice();
    }
  }
});

// Add customized item to cart
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('#modalAddToCartBtn');
  if (addBtn) {
    if (!currentCustomizingItem) return;

    let details = '';
    let customKey = '';

    if (currentCustomizingItem.category === 'bakery') {
      details = `${currentCustomizingItem.bakeryServing} • ${currentCustomizingItem.bakerySpread}`;
      customKey = `${currentCustomizingItem.id}-${currentCustomizingItem.bakeryServing}-${currentCustomizingItem.bakerySpread}`;
    } else if (currentCustomizingItem.category === 'breakfast') {
      const extras = [];
      if (currentCustomizingItem.breakfastEgg) extras.push('+Poached Egg');
      if (currentCustomizingItem.breakfastAvo) extras.push('+Avocado');
      details = `${currentCustomizingItem.breakfastBread}${extras.length ? ' • ' + extras.join(', ') : ''}`;
      customKey = `${currentCustomizingItem.id}-${currentCustomizingItem.breakfastBread}-${currentCustomizingItem.breakfastEgg}-${currentCustomizingItem.breakfastAvo}`;
    } else {
      details = `${currentCustomizingItem.selectedSize} • ${currentCustomizingItem.selectedMilk} • ${currentCustomizingItem.selectedSweetness} • ${currentCustomizingItem.selectedTemp}${currentCustomizingItem.extraShot ? ' • +Extra Shot' : ''}`;
      customKey = `${currentCustomizingItem.id}-${currentCustomizingItem.selectedSize}-${currentCustomizingItem.selectedMilk}-${currentCustomizingItem.selectedSweetness}-${currentCustomizingItem.selectedTemp}-${currentCustomizingItem.extraShot}`;
    }

    if (currentCustomizingItem.specialNotes) {
      details += ` • "${currentCustomizingItem.specialNotes}"`;
      customKey += `-${currentCustomizingItem.specialNotes}`;
    }

    const existingIndex = cart.findIndex(i => i.customKey === customKey);

    if (existingIndex > -1) {
      cart[existingIndex].qty += modalSelectedQty;
    } else {
      cart.push({
        id: currentCustomizingItem.id,
        customKey: customKey,
        name: currentCustomizingItem.name,
        price: currentCustomizingItem.calculatedPrice,
        image: currentCustomizingItem.image,
        details: details,
        qty: modalSelectedQty
      });
    }

    saveCart();
    renderCart();
    bounceCartBadges();
    showToast(`Added ${modalSelectedQty}x ${currentCustomizingItem.name} to order!`, 'success');

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
   ========================================================================== */

window.quickAddToCart = function(itemId, event) {
  const item = MENU_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  let details = '';
  let customKey = '';
  if (item.category === 'bakery') {
    details = 'Warm & Toasted • French Butter';
    customKey = `${item.id}-bakery-warm`;
  } else if (item.category === 'breakfast') {
    details = 'Artisan Sourdough • Standard Prep';
    customKey = `${item.id}-breakfast-std`;
  } else {
    details = 'Regular (12oz) • Whole Milk • Standard';
    customKey = `${item.id}-Regular-Whole Milk-Standard-false`;
  }

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
      details: details,
      qty: 1
    });
  }

  saveCart();
  renderCart();

  let sourceEl = null;
  if (event && event.currentTarget) {
    const card = event.currentTarget.closest('.menu-card') || event.currentTarget.closest('.row');
    sourceEl = card ? card.querySelector('img') : event.currentTarget;
  }
  triggerFlyToCart(sourceEl);

  showToast(`Added 1x ${item.name} to cart!`, 'success', {
    actionText: 'View Cart',
    onAction: openCartDrawer
  });
};

function saveCart() {
  localStorage.setItem('brew_haven_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const countBadge = document.getElementById('cartCountBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  const floatingCount = document.getElementById('floatingCartCount');
  const floatingTotal = document.getElementById('floatingCartTotal');
  const floatingPill = document.getElementById('floatingCartPill');

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalCount;
  if (drawerCount) drawerCount.textContent = totalCount;
  if (floatingCount) floatingCount.textContent = totalCount;
  if (floatingTotal) floatingTotal.textContent = `$${subtotal.toFixed(2)}`;

  if (floatingPill) {
    if (totalCount > 0 && window.scrollY > 280) {
      floatingPill.classList.add('show');
    } else {
      floatingPill.classList.remove('show');
    }
  }
}

function renderCart() {
  const container = document.getElementById('cartItemsContainer');
  const subtotalEl = document.getElementById('cartSubtotal');
  const discountRow = document.getElementById('cartDiscountRow');
  const discountEl = document.getElementById('cartDiscount');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const footerEl = document.getElementById('cartDrawerFooter');
  const perkBar = document.getElementById('cartPerkBar');
  const perkText = document.getElementById('perkStatusText');
  const perkPct = document.getElementById('perkProgressPct');

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
    if (perkBar) perkBar.style.width = '0%';
    if (perkPct) perkPct.textContent = '0%';
    if (perkText) perkText.innerHTML = '<i class="fa-solid fa-gift text-warning me-1"></i> Add $25.00 for a Free Butter Croissant!';
    updateCartBadge();
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
          <button class="btn-remove-item" onclick="removeCartItem(${idx})" title="Remove item">
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

  // Free Perk Progress Calculation (Target $25.00)
  const targetPerk = 25.00;
  if (perkBar && perkText && perkPct) {
    if (subtotal >= targetPerk) {
      perkBar.style.width = '100%';
      perkPct.textContent = '100%';
      perkText.innerHTML = '🎉 <strong>Free Fresh Croissant Unlocked!</strong> Included with your order.';
    } else {
      const remaining = targetPerk - subtotal;
      const pct = Math.min(100, Math.round((subtotal / targetPerk) * 100));
      perkBar.style.width = `${pct}%`;
      perkPct.textContent = `${pct}%`;
      perkText.innerHTML = `<i class="fa-solid fa-gift text-warning me-1"></i> Add $${remaining.toFixed(2)} for a <strong>Free Butter Croissant!</strong>`;
    }
  }

  updateCartBadge();
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
  const quickCouponBtn = document.getElementById('quickApplyHaven10');
  const couponInput = document.getElementById('cartCouponInput');
  const proceedBtn = document.getElementById('proceedCheckoutBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');

  if (openBtn) openBtn.addEventListener('click', openCartDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      cart = [];
      saveCart();
      renderCart();
      showToast('All items removed from cart', 'info');
    });
  }

  // Dining option switchers
  const diningPills = document.querySelectorAll('.dining-pill');
  diningPills.forEach(pill => {
    if (pill.dataset.type === currentDiningType) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }

    pill.addEventListener('click', () => {
      diningPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDiningType = pill.dataset.type;
      localStorage.setItem('brew_haven_dining', currentDiningType);
      showToast(`Switched order to ${pill.textContent.trim()}`, 'info');
    });
  });

  if (quickCouponBtn && couponInput) {
    quickCouponBtn.addEventListener('click', () => {
      couponInput.value = 'HAVEN10';
      activeCoupon = 'HAVEN10';
      localStorage.setItem('brew_haven_coupon', 'HAVEN10');
      renderCart();
      showToast('Promo code HAVEN10 applied! 10% discount added.', 'success');
    });
  }

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
        showToast('Promo code removed', 'info');
      } else {
        showToast('Invalid promo code. Try HAVEN10', 'info');
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

function initFloatingCart() {
  const pill = document.getElementById('floatingCartPill');
  if (!pill) return;

  pill.addEventListener('click', openCartDrawer);

  window.addEventListener('scroll', () => {
    updateCartBadge();
  });
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
   ========================================================================== */

function openCheckoutModal() {
  const totalEl = document.getElementById('cartTotal');
  const checkoutTotal = document.getElementById('checkoutOrderTotal');
  if (checkoutTotal && totalEl) {
    checkoutTotal.textContent = totalEl.textContent;
  }

  // Populate itemized list preview
  const listEl = document.getElementById('checkoutItemsList');
  if (listEl) {
    listEl.innerHTML = cart.map(item => `
      <div class="checkout-item-line">
        <div>
          <span class="fw-bold text-light">${item.qty}x ${item.name}</span>
          <div class="text-muted small">${item.details}</div>
        </div>
        <span class="text-warning fw-bold font-serif">$${(item.price * item.qty).toFixed(2)}</span>
      </div>
    `).join('');
  }

  // Sync dining options
  const badge = document.getElementById('checkoutDiningBadge');
  const diningLabel = document.getElementById('checkoutDiningLabel');
  const tableInput = document.getElementById('orderTableNumber');
  const pickupSelect = document.getElementById('orderPickupTime');

  if (badge) {
    badge.textContent = currentDiningType.charAt(0).toUpperCase() + currentDiningType.slice(1);
  }

  if (currentDiningType === 'dinein') {
    if (diningLabel) diningLabel.textContent = 'Table Number / Seating Zone *';
    if (tableInput) {
      tableInput.classList.remove('d-none');
      tableInput.required = true;
    }
    if (pickupSelect) {
      pickupSelect.classList.add('d-none');
      pickupSelect.required = false;
    }
  } else {
    if (diningLabel) diningLabel.textContent = currentDiningType === 'curbside' ? 'Curbside Vehicle Model & Time *' : 'Pickup Time Slot *';
    if (tableInput) {
      tableInput.classList.add('d-none');
      tableInput.required = false;
    }
    if (pickupSelect) {
      pickupSelect.classList.remove('d-none');
      pickupSelect.required = true;
    }
  }

  const modalEl = document.getElementById('checkoutModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   CHECKOUT, BOOKING & 3-WAY PAYMENT GATEWAY SYSTEM
   ========================================================================== */

let selectedPaymentMethod = 'Pay at Counter';
let isTableBookingSelected = false;
let currentCustomerWallet = { balance: 25.00, phone: '', name: 'Valued Guest' };

async function fetchCustomerWallet(phone) {
  if (!phone || phone.trim().length < 6) return currentCustomerWallet;
  try {
    const res = await fetch(`/api/wallet/${encodeURIComponent(phone.trim())}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        currentCustomerWallet.balance = parseFloat(json.data.walletBalance) || 0;
        currentCustomerWallet.name = json.data.customerName || 'Valued Guest';
        currentCustomerWallet.phone = phone.trim();

        // Update UI badges
        const balText = `$${currentCustomerWallet.balance.toFixed(2)}`;
        const checkoutBal = document.getElementById('checkoutWalletBalText');
        if (checkoutBal) checkoutBal.textContent = balText;

        const panelBal = document.getElementById('panelWalletBalDisplay');
        if (panelBal) panelBal.textContent = balText;

        const navPill = document.getElementById('navWalletPill');
        if (navPill) navPill.textContent = balText;

        // Check if balance meets current cart total
        checkWalletSufficiency();
      }
    }
  } catch (err) {
    console.warn('Could not fetch wallet:', err);
  }
  return currentCustomerWallet;
}

function checkWalletSufficiency() {
  const totalEl = document.getElementById('checkoutOrderTotal');
  const total = totalEl ? (parseFloat(totalEl.textContent.replace('$', '')) || 0) : 0;
  const warningEl = document.getElementById('walletInsufficientWarning');
  const submitBtn = document.getElementById('submitOrderBtn');

  if (selectedPaymentMethod === 'Haven Wallet') {
    if (currentCustomerWallet.balance < total) {
      if (warningEl) {
        warningEl.classList.remove('d-none');
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i> Balance: <strong>$${currentCustomerWallet.balance.toFixed(2)}</strong> is less than <strong>$${total.toFixed(2)}</strong>. Please top up below:`;
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-wallet me-1"></i> Top-Up Needed to Pay ($${total.toFixed(2)})`;
      }
    } else {
      if (warningEl) warningEl.classList.add('d-none');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Confirm & Pay with Wallet ($${total.toFixed(2)})`;
      }
    }
  }
}

function initCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  const phoneInput = document.getElementById('orderCustPhone');
  const nameInput = document.getElementById('orderCustName');

  // Pre-fill today for booking date
  const bookingDateInput = document.getElementById('bookingDate');
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  // 1. DINING / TABLE RESERVATION TOGGLES
  const pillTakeaway = document.getElementById('pillTakeaway');
  const pillDineIn = document.getElementById('pillDineIn');
  const takeawaySlotWrapper = document.getElementById('takeawaySlotWrapper');
  const dineInFieldsWrapper = document.getElementById('dineInFieldsWrapper');
  const checkoutDiningBadge = document.getElementById('checkoutDiningBadge');

  if (pillTakeaway && pillDineIn) {
    pillTakeaway.addEventListener('click', () => {
      isTableBookingSelected = false;
      currentDiningType = 'takeaway';
      pillTakeaway.classList.add('active');
      pillDineIn.classList.remove('active');
      if (takeawaySlotWrapper) takeawaySlotWrapper.classList.remove('d-none');
      if (dineInFieldsWrapper) dineInFieldsWrapper.classList.add('d-none');
      if (checkoutDiningBadge) {
        checkoutDiningBadge.textContent = 'Takeaway';
        checkoutDiningBadge.className = 'badge-tag badge-gold';
      }
    });

    pillDineIn.addEventListener('click', () => {
      isTableBookingSelected = true;
      currentDiningType = 'dinein';
      pillDineIn.classList.add('active');
      pillTakeaway.classList.remove('active');
      if (takeawaySlotWrapper) takeawaySlotWrapper.classList.add('d-none');
      if (dineInFieldsWrapper) dineInFieldsWrapper.classList.remove('d-none');
      if (checkoutDiningBadge) {
        checkoutDiningBadge.textContent = 'Reserved Table (Dine-In)';
        checkoutDiningBadge.className = 'badge-tag badge-outline';
      }
    });
  }

  // 2. PAYMENT METHOD SELECTION
  const cardCounter = document.getElementById('methodCounterCard');
  const cardWallet = document.getElementById('methodWalletCard');
  const cardCard = document.getElementById('methodCardCard');
  const walletPanel = document.getElementById('walletDetailsPanel');
  const cardGatewayPanel = document.getElementById('cardGatewayPanel');
  const noteEl = document.getElementById('checkoutPaymentNote');

  function updatePaymentMethod(method) {
    selectedPaymentMethod = method;

    [cardCounter, cardWallet, cardCard].forEach(c => {
      if (c) c.classList.remove('active');
    });

    const totalEl = document.getElementById('checkoutOrderTotal');
    const total = totalEl ? totalEl.textContent : '$0.00';
    const submitBtn = document.getElementById('submitOrderBtn');

    if (method === 'Pay at Counter') {
      if (cardCounter) cardCounter.classList.add('active');
      if (walletPanel) walletPanel.classList.add('d-none');
      if (cardGatewayPanel) cardGatewayPanel.classList.add('d-none');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Confirm & Place Order (At Counter)`;
      }
      if (noteEl) {
        noteEl.innerHTML = `<i class="fa-solid fa-info-circle me-1"></i> Option 1: Pay at Counter. Order is <strong>Pending</strong>; staff confirms when served.`;
      }
    } else if (method === 'Haven Wallet') {
      if (cardWallet) cardWallet.classList.add('active');
      if (walletPanel) walletPanel.classList.remove('d-none');
      if (cardGatewayPanel) cardGatewayPanel.classList.add('d-none');
      if (noteEl) {
        noteEl.innerHTML = `<i class="fa-solid fa-wallet me-1"></i> Option 2: Haven Wallet. 1-click booking deducted from your digital balance.`;
      }
      // Load customer balance for current phone
      if (phoneInput && phoneInput.value.trim()) {
        fetchCustomerWallet(phoneInput.value.trim());
      }
      checkWalletSufficiency();
    } else if (method === 'Credit Card') {
      if (cardCard) cardCard.classList.add('active');
      if (walletPanel) walletPanel.classList.add('d-none');
      if (cardGatewayPanel) cardGatewayPanel.classList.remove('d-none');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-lock me-1"></i> Authorize & Pay (${total}) via Gateway`;
      }
      if (noteEl) {
        noteEl.innerHTML = `<i class="fa-solid fa-shield-halved me-1"></i> Option 3: Card Gateway. 256-bit encrypted card checkout & instant confirmation.`;
      }
    }
  }

  if (cardCounter) cardCounter.addEventListener('click', () => updatePaymentMethod('Pay at Counter'));
  if (cardWallet) cardWallet.addEventListener('click', () => updatePaymentMethod('Haven Wallet'));
  if (cardCard) cardCard.addEventListener('click', () => updatePaymentMethod('Credit Card'));

  // 3. AUTO-LOAD WALLET ON PHONE INPUT
  let phoneDebounce = null;
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      clearTimeout(phoneDebounce);
      phoneDebounce = setTimeout(() => {
        if (phoneInput.value.trim().length >= 6) {
          fetchCustomerWallet(phoneInput.value.trim());
        }
      }, 500);
    });
  }

  // 4. QUICK TOP-UP BUTTONS INSIDE CHECKOUT
  const topupPills = document.querySelectorAll('.btn-topup-pill');
  topupPills.forEach(pill => {
    pill.addEventListener('click', async () => {
      const amount = parseFloat(pill.dataset.amount) || 10;
      const phone = phoneInput ? phoneInput.value.trim() : '+61 400 123 456';
      const name = nameInput ? nameInput.value.trim() : 'Valued Guest';

      const spinner = document.getElementById('topupSpinner');
      if (spinner) spinner.classList.remove('d-none');

      try {
        const res = await fetch('/api/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phone || '+61 400 123 456', customerName: name, amount: amount })
        });

        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            currentCustomerWallet.balance = json.data.walletBalance;
            const balStr = `$${currentCustomerWallet.balance.toFixed(2)}`;
            const checkoutBal = document.getElementById('checkoutWalletBalText');
            if (checkoutBal) checkoutBal.textContent = balStr;
            const panelBal = document.getElementById('panelWalletBalDisplay');
            if (panelBal) panelBal.textContent = balStr;
            const navPill = document.getElementById('navWalletPill');
            if (navPill) navPill.textContent = balStr;

            showToast(`Added $${amount.toFixed(2)} to your Haven Wallet! New Balance: ${balStr}`, 'success');
            checkWalletSufficiency();
          }
        }
      } catch (err) {
        showToast('Top-up connection error', 'error');
      } finally {
        if (spinner) spinner.classList.add('d-none');
      }
    });
  });

  const refreshWalletBtn = document.getElementById('refreshWalletBtn');
  if (refreshWalletBtn) {
    refreshWalletBtn.addEventListener('click', () => {
      const phone = phoneInput ? phoneInput.value.trim() : '+61 400 123 456';
      fetchCustomerWallet(phone);
      showToast('Wallet refreshed', 'info');
    });
  }

  // 5. CARD GATEWAY INTERACTION & AUTO-FILL
  const fillDemoCardBtn = document.getElementById('fillDemoCardBtn');
  const cardNumInput = document.getElementById('cardNumInput');
  const cardHolderInput = document.getElementById('cardHolderInput');
  const cardExpiryInput = document.getElementById('cardExpiryInput');
  const cardCvcInput = document.getElementById('cardCvcInput');
  const cardZipInput = document.getElementById('cardZipInput');

  const cardNumPreview = document.getElementById('cardNumPreview');
  const cardHolderPreview = document.getElementById('cardHolderPreview');
  const cardExpiryPreview = document.getElementById('cardExpiryPreview');
  const cardBrandLogo = document.getElementById('cardBrandLogo');

  if (fillDemoCardBtn) {
    fillDemoCardBtn.addEventListener('click', () => {
      if (cardNumInput) cardNumInput.value = '4242 4242 4242 4242';
      if (cardHolderInput) cardHolderInput.value = (nameInput && nameInput.value.trim()) ? nameInput.value.trim().toUpperCase() : 'ELENA ROSTOVA';
      if (cardExpiryInput) cardExpiryInput.value = '12/28';
      if (cardCvcInput) cardCvcInput.value = '123';
      if (cardZipInput) cardZipInput.value = '3000';

      if (cardNumPreview) cardNumPreview.textContent = '4242 •••• •••• 4242';
      if (cardHolderPreview) cardHolderPreview.textContent = (nameInput && nameInput.value.trim()) ? nameInput.value.trim().toUpperCase() : 'ELENA ROSTOVA';
      if (cardExpiryPreview) cardExpiryPreview.textContent = '12/28';
      if (cardBrandLogo) cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-visa text-warning"></i>';

      showToast('Demo test card details filled!', 'info');
    });
  }

  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;

      if (cardNumPreview) {
        if (val.length >= 4) {
          cardNumPreview.textContent = formatted;
        } else {
          cardNumPreview.textContent = '•••• •••• •••• 4242';
        }
      }

      if (cardBrandLogo) {
        if (val.startsWith('4')) {
          cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-visa text-warning"></i>';
        } else if (val.startsWith('5')) {
          cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-mastercard text-danger"></i>';
        } else if (val.startsWith('3')) {
          cardBrandLogo.innerHTML = '<i class="fa-brands fa-cc-amex text-info"></i>';
        } else {
          cardBrandLogo.innerHTML = '<i class="fa-solid fa-credit-card"></i>';
        }
      }
    });
  }

  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', (e) => {
      if (cardHolderPreview) {
        cardHolderPreview.textContent = e.target.value.trim().toUpperCase() || 'VALUED GUEST';
      }
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        e.target.value = `${val.substring(0, 2)}/${val.substring(2)}`;
      } else {
        e.target.value = val;
      }
      if (cardExpiryPreview) cardExpiryPreview.textContent = e.target.value || '12/28';
    });
  }

  // 6. FORM SUBMIT HANDLER
  form.addEventListener('submit', async (e) => {
    lastDashboardTab = 'bookings';
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty. Please add items to order.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submitOrderBtn');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    const name = nameInput ? nameInput.value.trim() : 'Guest';
    const phone = phoneInput ? phoneInput.value.trim() : '+61 400 123 456';
    const emailInput = document.getElementById('orderCustEmail');
    const email = (emailInput && emailInput.value.trim()) ? emailInput.value.trim() : null;
    const notesInput = document.getElementById('orderNotesInput');
    const notes = notesInput ? notesInput.value.trim() : '';

    // Calculate totals
    const totalEl = document.getElementById('checkoutOrderTotal');
    const totalAmount = totalEl ? (parseFloat(totalEl.textContent.replace('$', '')) || 0) : 0;
    const itemsCount = cart.reduce((sum, i) => sum + i.qty, 0);

    // Validate Payment Specific Requirements
    if (selectedPaymentMethod === 'Haven Wallet') {
      if (currentCustomerWallet.balance < totalAmount) {
        showToast(`Insufficient balance ($${currentCustomerWallet.balance.toFixed(2)} available). Please top up first.`, 'error');
        return;
      }
    } else if (selectedPaymentMethod === 'Credit Card') {
      const cardNum = cardNumInput ? cardNumInput.value.replace(/\s+/g, '') : '';
      if (!cardNum || cardNum.length < 12) {
        showToast('Please enter a valid card number or click "Auto-Fill Test Card".', 'error');
        return;
      }
    }

    // Determine Dining & Booking details
    let locationDetail = '';
    let tableBookingData = {
      reserveTable: isTableBookingSelected,
      partySize: 2,
      reservationDate: null,
      reservationTime: null,
      seatingZone: 'Indoor Lounge'
    };

    if (isTableBookingSelected) {
      const guestsSel = document.getElementById('bookingGuests');
      const dateInp = document.getElementById('bookingDate');
      const timeSel = document.getElementById('bookingTime');
      const zoneSel = document.getElementById('bookingZone');

      tableBookingData.partySize = guestsSel ? parseInt(guestsSel.value, 10) : 2;
      tableBookingData.reservationDate = dateInp ? dateInp.value : new Date().toISOString().split('T')[0];
      tableBookingData.reservationTime = timeSel ? timeSel.value : '10:00 AM';
      tableBookingData.seatingZone = zoneSel ? zoneSel.value : 'Indoor Lounge';
      locationDetail = `Reserved Table (${tableBookingData.partySize} guests • ${tableBookingData.seatingZone} • ${tableBookingData.reservationTime})`;
    } else {
      const pickupSelect = document.getElementById('orderPickupTime');
      locationDetail = pickupSelect ? pickupSelect.value : 'ASAP (15-20 mins)';
    }

    // Card Details payload if Card option
    let cardPayload = null;
    if (selectedPaymentMethod === 'Credit Card') {
      cardPayload = {
        cardNumber: cardNumInput ? cardNumInput.value.trim() : '4242 4242 4242 4242',
        cardHolder: cardHolderInput ? cardHolderInput.value.trim() : name,
        expiryDate: cardExpiryInput ? cardExpiryInput.value.trim() : '12/28',
        cvc: cardCvcInput ? cardCvcInput.value.trim() : '123',
        zipCode: cardZipInput ? cardZipInput.value.trim() : '3000'
      };
    }

    const payload = {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      diningOption: isTableBookingSelected ? 'dinein' : 'takeaway',
      pickupTimeOrTable: locationDetail,
      specialNotes: notes,
      paymentMethod: selectedPaymentMethod,
      promoCode: activeCoupon || null,
      cardDetails: cardPayload,
      reserveTable: isTableBookingSelected,
      partySize: tableBookingData.partySize,
      reservationDate: tableBookingData.reservationDate,
      reservationTime: tableBookingData.reservationTime,
      seatingZone: tableBookingData.seatingZone,
      items: cart.map(item => ({
        menuItemId: item.id || 0,
        itemName: item.name,
        imageUrl: item.img || null,
        unitPrice: parseFloat(item.price) || 0,
        quantity: parseInt(item.qty, 10) || 1,
        customDetails: item.details || ''
      }))
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      if (selectedPaymentMethod === 'Credit Card') {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Authorizing Payment Gateway (256-bit SSL)...';
      } else {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Booking...';
      }
    }

    let stripePaymentIntentId = null;
    if (selectedPaymentMethod === 'Credit Card') {
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connecting to Stripe Gateway (256-bit SSL)...';
      }
      try {
        const intentRes = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'usd',
            customerName: name,
            customerEmail: email || 'guest@brewhaven.cafe',
            orderReference: `BH-${Math.floor(100000 + Math.random() * 900000)}`
          })
        });
        if (intentRes.ok) {
          const intentData = await intentRes.json();
          if (intentData && intentData.success && intentData.data) {
            stripePaymentIntentId = intentData.data.paymentIntentId;
          }
        }
      } catch (intentErr) {
        console.warn('Stripe gateway API error, using simulation fallback:', intentErr);
        stripePaymentIntentId = `pi_test_${Math.floor(100000 + Math.random() * 900000)}`;
      }
      payload.paymentIntentId = stripePaymentIntentId;
      if (payload.cardDetails) payload.cardDetails.paymentIntentId = stripePaymentIntentId;
    }
    lastDashboardTab = 'orders';

    let orderReference = `BH-${Math.floor(100000 + Math.random() * 900000)}`;
    let bookingCode = null;
    let paymentStatus = selectedPaymentMethod === 'Pay at Counter' ? 'Unpaid (At Counter)' : 'Paid';
    let transactionId = null;
    let isPersistedToDb = false;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.success && result.data) {
          orderReference = result.data.orderReference;
          bookingCode = result.data.bookingCode;
          paymentStatus = result.data.paymentStatus;
          transactionId = result.data.transactionId;
          isPersistedToDb = true;

          showToast(`Order ${orderReference} confirmed in SQLite database!`, 'success');

          // Refresh wallet balance after debit
          if (selectedPaymentMethod === 'Haven Wallet') {
            fetchCustomerWallet(phone);
          }
        }
      } else {
        const errResult = await response.json().catch(() => null);
        const errMsg = errResult?.message || 'Server error occurred during checkout.';
        showToast(errMsg, 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        return;
      }
    } catch (networkErr) {
      console.warn('Could not connect to /api/orders, running in offline fallback:', networkErr);
      showToast('Offline Mode: Order recorded locally', 'info');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }

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

    let statusBadgeHtml = '';
    if (selectedPaymentMethod === 'Pay at Counter') {
      statusBadgeHtml = `<span class="badge bg-warning-subtle text-warning border border-warning"><i class="fa-solid fa-clock me-1"></i>Pending • Pay at Counter</span>`;
    } else if (selectedPaymentMethod === 'Haven Wallet') {
      statusBadgeHtml = `<span class="badge bg-success-subtle text-success border border-success"><i class="fa-solid fa-check-circle me-1"></i>Paid via Haven Wallet</span>`;
    } else {
      statusBadgeHtml = `<span class="badge bg-info-subtle text-info border border-info"><i class="fa-solid fa-credit-card me-1"></i>Paid via Card Gateway</span>`;
    }

    if (confirmTitle) confirmTitle.textContent = isTableBookingSelected ? "Table & Order Confirmed!" : "Order Placed Successfully!";
    if (confirmMessage) {
      if (selectedPaymentMethod === 'Pay at Counter') {
        confirmMessage.textContent = `Thank you, ${name}! Your order has been placed as Pending. Please pay at the counter when our barista serves your order.`;
      } else {
        confirmMessage.textContent = `Thank you, ${name}! Your payment has been authorized and your cafe booking is confirmed.`;
      }
    }

    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div class="mb-2"><strong>Order Reference:</strong> <span class="text-warning fw-bold">${orderReference}</span> ${isPersistedToDb ? '<span class="badge bg-success-subtle text-success ms-1"><i class="fa-solid fa-database me-1"></i>SQLite Stored</span>' : ''}</div>
        ${bookingCode ? `<div class="mb-2"><strong>Table Reservation Code:</strong> <span class="text-info fw-bold">${bookingCode}</span> <span class="badge bg-info-subtle text-info ms-1"><i class="fa-solid fa-chair me-1"></i>Table Reserved</span></div>` : ''}
        <div class="mb-1"><strong>Dining Preference:</strong> <span class="badge-tag badge-gold">${(isTableBookingSelected ? 'Dine-In Table' : 'Takeaway').toUpperCase()}</span></div>
        <div class="mb-1"><strong>Details:</strong> ${escapeHtml(locationDetail)}</div>
        <div class="mb-1"><strong>Items Ordered:</strong> ${itemsCount} items</div>
        ${notes ? `<div class="mb-1"><strong>Barista Notes:</strong> "${escapeHtml(notes)}"</div>` : ''}
        <div class="mb-1"><strong>Contact Phone:</strong> ${escapeHtml(phone)}</div>
        <div class="mb-1"><strong>Payment Method:</strong> ${escapeHtml(selectedPaymentMethod)}</div>
        <div class="mb-1"><strong>Payment Status:</strong> ${statusBadgeHtml}</div>
        ${transactionId ? `<div class="mb-1 text-muted small"><strong>Transaction ID:</strong> <code>${transactionId}</code></div>` : ''}
        <div class="mt-2 pt-2 border-top border-secondary d-flex justify-content-between align-items-center">
          <strong>Total Amount:</strong> <span class="text-warning fw-bold fs-5">$${totalAmount.toFixed(2)}</span>
        </div>
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

    // Reload live orders if modal is active
    loadLiveOrders();
  });
}

/* ==========================================================================
   TABLE RESERVATION FORM
   ========================================================================= */

function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving Reservation...';
    }

    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const guests = parseInt(document.getElementById('resGuests').value, 10);
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const zoneRadio = document.querySelector('input[name="seatingZone"]:checked');
    const zone = zoneRadio ? zoneRadio.value : 'Main Roastery Hall';

    let refCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    let isPersisted = false;

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: name,
          email: email,
          phone: phone,
          partySize: guests,
          reservationDate: date,
          reservationTime: time,
          seatingZone: zone
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result && result.success && result.data) {
          refCode = result.data.referenceCode;
          isPersisted = true;
          showToast(`Table reserved! Booking code ${refCode} stored in DB`, 'success');
        }
      }
    } catch (err) {
      console.warn('API error saving reservation:', err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }

    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmDetails = document.getElementById('confirmDetails');

    if (confirmTitle) confirmTitle.textContent = "Table Reserved!";
    if (confirmMessage) confirmMessage.textContent = `We look forward to welcoming you, ${name}!`;
    if (confirmDetails) {
      confirmDetails.innerHTML = `
        <div class="mb-2"><strong>Reservation Ref:</strong> <span class="text-warning fw-bold">${refCode}</span> ${isPersisted ? '<span class="badge bg-success-subtle text-success ms-1">Stored in SQLite</span>' : ''}</div>
        <div class="mb-1"><strong>Party Size:</strong> ${guests} Guests</div>
        <div class="mb-1"><strong>Date & Time:</strong> ${escapeHtml(date)} at ${escapeHtml(time)}</div>
        <div class="mb-1"><strong>Seating Area:</strong> ${escapeHtml(zone)}</div>
        <div class="mb-1"><strong>Confirmation Sent To:</strong> ${escapeHtml(email)}</div>
        <div class="mt-2 small text-secondary">A reminder SMS will be sent to ${escapeHtml(phone)} 1 hour prior.</div>
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
    quickAddBtn.addEventListener('click', (e) => {
      quickAddToCart(1, e);
    });
  }
}

/* ==========================================================================
   NEWSLETTER FORM
   ========================================================================= */

function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) return;

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        const result = await response.json();
        showToast(result.message || `Welcome to VIP Coffee Club!`, 'success');
      } else {
        showToast(`Welcome to the Haven Club! Free croissant voucher sent to ${email}`, 'success');
      }
    } catch {
      showToast(`Welcome to the Haven Club! Free croissant voucher sent to ${email}`, 'success');
    }

    form.reset();
  });
}

/* ==========================================================================
   LIVE ORDERS DASHBOARD (SQLite DB Integration)
   ========================================================================= */

function initLiveOrdersModal() {
  const openBtn = document.getElementById('openOrdersBtn');
  const refreshBtn = document.getElementById('refreshOrdersBtn');
  const modalEl = document.getElementById('liveOrdersModal');
  const viewInDashboardBtn = document.getElementById('viewInDashboardBtn');
  const tabOrdersBtn = document.getElementById('tabOrdersBtn');
  const tabBookingsBtn = document.getElementById('tabBookingsBtn');

  if (openBtn && modalEl && typeof bootstrap !== 'undefined') {
    openBtn.addEventListener('click', () => {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
      loadLiveOrders();
    });
  }

  if (viewInDashboardBtn && modalEl && typeof bootstrap !== 'undefined') {
    viewInDashboardBtn.addEventListener('click', () => {
      const confirmModalEl = document.getElementById('confirmationModal');
      if (confirmModalEl && typeof bootstrap !== 'undefined') {
        const confirmModal = bootstrap.Modal.getInstance(confirmModalEl);
        if (confirmModal) confirmModal.hide();
      }
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();

      if (lastDashboardTab === 'bookings' && tabBookingsBtn && typeof bootstrap !== 'undefined') {
        const tab = bootstrap.Tab.getOrCreateInstance(tabBookingsBtn);
        tab.show();
      } else if (tabOrdersBtn && typeof bootstrap !== 'undefined') {
        const tab = bootstrap.Tab.getOrCreateInstance(tabOrdersBtn);
        tab.show();
      }
      loadLiveOrders();
    });
  }

  if (tabOrdersBtn) {
    tabOrdersBtn.addEventListener('click', () => { lastDashboardTab = 'orders'; });
  }
  if (tabBookingsBtn) {
    tabBookingsBtn.addEventListener('click', () => { lastDashboardTab = 'bookings'; });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadLiveOrders();
    });
  }
}

async function loadLiveOrders() {
  const loadingEl = document.getElementById('liveOrdersLoading');
  const emptyEl = document.getElementById('liveOrdersEmpty');
  const tableWrapper = document.getElementById('liveOrdersTableWrapper');
  const tbody = document.getElementById('liveOrdersTbody');

  if (!loadingEl || !emptyEl || !tableWrapper || !tbody) return;

  loadingEl.classList.remove('d-none');
  emptyEl.classList.add('d-none');
  tableWrapper.classList.add('d-none');

  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const orders = (data && data.success && Array.isArray(data.data)) ? data.data : [];

    loadingEl.classList.add('d-none');

    if (orders.length === 0) {
      emptyEl.classList.remove('d-none');
      tableWrapper.classList.add('d-none');
      return;
    }

    emptyEl.classList.add('d-none');
    tableWrapper.classList.remove('d-none');

    tbody.innerHTML = orders.map(order => {
      const statusLower = (order.status || 'pending').toLowerCase();
      let statusBadgeClass = 'badge-status-pending';
      if (statusLower === 'brewing' || statusLower === 'preparing') statusBadgeClass = 'badge-status-brewing';
      else if (statusLower === 'completed' || statusLower === 'ready') statusBadgeClass = 'badge-status-completed';
      else if (statusLower === 'cancelled') statusBadgeClass = 'badge-status-cancelled';

      const itemsSummary = (order.items && order.items.length > 0)
        ? order.items.map(i => `${i.quantity}x ${escapeHtml(i.itemName)}`).join(', ')
        : 'Specialty Selection';

      const placedDate = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Recently';

      // Determine Payment Badge & Label
      const payMethodLower = (order.paymentMethod || '').toLowerCase();
      const payStatusLower = (order.paymentStatus || '').toLowerCase();
      let paymentBadgeHtml = '';

      if (payMethodLower.includes('wallet') || payStatusLower.includes('wallet')) {
        paymentBadgeHtml = `
          <span class="badge-tag badge-pay-wallet"><i class="fa-solid fa-wallet me-1"></i>Wallet</span>
          <div class="text-secondary small mt-1" style="font-size: 0.7rem;">Paid &bull; <code>${escapeHtml(order.transactionId || 'WAL-PAY')}</code></div>
        `;
      } else if (payMethodLower.includes('card') || payStatusLower.includes('card')) {
        paymentBadgeHtml = `
          <span class="badge-tag badge-pay-card"><i class="fa-solid fa-credit-card me-1"></i>Card Gateway</span>
          <div class="text-secondary small mt-1" style="font-size: 0.7rem;">Paid &bull; <code>${escapeHtml(order.transactionId ? order.transactionId.substring(0, 16) + '...' : 'APPROVED')}</code></div>
        `;
      } else {
        const isCounterPaid = payStatusLower.includes('paid');
        paymentBadgeHtml = `
          <span class="badge-tag badge-pay-counter"><i class="fa-solid fa-shop me-1"></i>At Counter</span>
          <div class="small mt-1 ${isCounterPaid ? 'text-success fw-bold' : 'text-warning'} style="font-size: 0.7rem;">
            ${isCounterPaid ? '<i class="fa-solid fa-check me-1"></i>Paid at Counter' : '<i class="fa-solid fa-clock me-1"></i>Unpaid (Counter)'}
          </div>
        `;
      }

      // Check if At-Counter order needs Barista serving action
      const needsCounterConfirmation = (payMethodLower.includes('counter') || payStatusLower.includes('unpaid')) && !payStatusLower.includes('paid') && statusLower !== 'completed';

      return `
        <tr>
          <td>
            <span class="order-ref-pill">${escapeHtml(order.orderReference)}</span>
          </td>
          <td>
            <div class="fw-bold text-light">${escapeHtml(order.customerName || 'Guest')}</div>
            <div class="text-secondary small">${escapeHtml(order.customerPhone || '')}</div>
          </td>
          <td>
            <span class="badge-tag badge-outline text-uppercase" style="font-size: 0.72rem;">${escapeHtml(order.diningOption || 'takeaway')}</span>
            ${order.bookingCode ? `<span class="badge bg-warning-subtle text-warning fw-bold ms-1" style="font-size: 0.7rem;" title="Table Reserved"><i class="fa-solid fa-chair me-1"></i>${escapeHtml(order.bookingCode)}</span>` : ''}
            <div class="text-secondary small mt-1">${escapeHtml(order.pickupTimeOrTable || '')}</div>
          </td>
          <td>
            <div class="order-items-snippet" title="${escapeHtml(itemsSummary)}">
              ${itemsSummary}
            </div>
          </td>
          <td>
            <span class="text-warning fw-bold font-serif fs-6">$${(order.totalAmount || 0).toFixed(2)}</span>
          </td>
          <td>
            ${paymentBadgeHtml}
          </td>
          <td>
            <span class="badge-order-status ${statusBadgeClass}">
              ${escapeHtml(order.status || 'Pending')}
            </span>
          </td>
          <td class="text-secondary small">
            ${placedDate}
          </td>
          <td class="text-end">
            <div class="d-flex align-items-center justify-content-end gap-1">
              ${needsCounterConfirmation ? `
                <button class="btn-serve-counter" onclick="confirmCounterOrder(${order.id})" title="Serve Order & Confirm Counter Payment">
                  <i class="fa-solid fa-check me-1"></i>Serve &amp; Confirm
                </button>
              ` : ''}
              <div class="dropdown d-inline-block">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle py-1 px-2 text-gold" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 0.78rem;">
                  Status
                </button>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li><button class="dropdown-item small" type="button" onclick="updateOrderStatus(${order.id}, 'Pending')"><i class="fa-solid fa-clock text-warning me-2"></i>Pending</button></li>
                  <li><button class="dropdown-item small" type="button" onclick="updateOrderStatus(${order.id}, 'Brewing')"><i class="fa-solid fa-mug-hot text-info me-2"></i>Brewing</button></li>
                  <li><button class="dropdown-item small" type="button" onclick="updateOrderStatus(${order.id}, 'Completed')"><i class="fa-solid fa-circle-check text-success me-2"></i>Completed</button></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item small text-danger" type="button" onclick="updateOrderStatus(${order.id}, 'Cancelled')"><i class="fa-solid fa-ban me-2"></i>Cancelled</button></li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.warn('Error loading orders from API:', err);
    loadingEl.classList.add('d-none');
    tableWrapper.classList.add('d-none');
    emptyEl.classList.remove('d-none');
    const emptyP = emptyEl.querySelector('p');
    if (emptyP) emptyP.textContent = 'Could not connect to /api/orders. Ensure the ASP.NET Core server is running.';
  }
}

window.confirmCounterOrder = async function(orderId) {
  try {
    const res = await fetch(`/api/orders/${orderId}/confirm-counter`, {
      method: 'PATCH'
    });

    if (res.ok) {
      showToast('Order served & confirmed as Paid at Counter!', 'success');
      loadLiveOrders();
    } else {
      showToast('Failed to confirm counter order', 'error');
    }
  } catch (err) {
    showToast('Network error while confirming order', 'error');
  }
};

window.updateOrderStatus = async function(orderId, newStatus) {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      showToast(`Order status updated to "${newStatus}"`, 'success');
      loadLiveOrders();
    } else {
      showToast('Failed to update status', 'error');
    }
  } catch (err) {
    showToast('Network error while updating status', 'error');
  }
};

/* ==========================================================================
   HAVEN DIGITAL WALLET SYSTEM & MODAL
   ========================================================================== */

function initHavenWalletSystem() {
  const openWalletBtn = document.getElementById('openWalletBtn');
  const walletModalEl = document.getElementById('walletModal');
  const phoneLookupInput = document.getElementById('walletPhoneLookup');
  const btnCheckWallet = document.getElementById('btnCheckWallet');
  const btnExecuteModalTopup = document.getElementById('btnExecuteModalTopup');
  const topupAmtBtns = document.querySelectorAll('.btn-modal-topup');
  let selectedModalTopupAmt = 50;

  if (openWalletBtn && walletModalEl && typeof bootstrap !== 'undefined') {
    openWalletBtn.addEventListener('click', () => {
      const modal = bootstrap.Modal.getOrCreateInstance(walletModalEl);
      modal.show();
      loadWalletDashboard();
    });
  }

  if (btnCheckWallet) {
    btnCheckWallet.addEventListener('click', () => loadWalletDashboard());
  }

  topupAmtBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      topupAmtBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedModalTopupAmt = parseFloat(btn.dataset.amt) || 50;
      const display = document.getElementById('selectedTopupDisplay');
      if (display) display.textContent = `$${selectedModalTopupAmt.toFixed(2)}`;
    });
  });

  if (btnExecuteModalTopup) {
    btnExecuteModalTopup.addEventListener('click', async () => {
      const phone = phoneLookupInput ? phoneLookupInput.value.trim() : '+61 400 123 456';
      btnExecuteModalTopup.disabled = true;
      btnExecuteModalTopup.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Crediting Wallet...';

      try {
        const res = await fetch('/api/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            customerName: currentCustomerWallet.name || 'Valued Guest',
            amount: selectedModalTopupAmt
          })
        });

        if (res.ok) {
          showToast(`Added $${selectedModalTopupAmt.toFixed(2)} to Haven Wallet!`, 'success');
          loadWalletDashboard();
        } else {
          showToast('Failed to top up wallet', 'error');
        }
      } catch (err) {
        showToast('Network error during top-up', 'error');
      } finally {
        btnExecuteModalTopup.disabled = false;
        btnExecuteModalTopup.innerHTML = `<i class="fa-solid fa-plus-circle me-1"></i> Add <span id="selectedTopupDisplay">$${selectedModalTopupAmt.toFixed(2)}</span> to Haven Wallet`;
      }
    });
  }

  async function loadWalletDashboard() {
    const phone = phoneLookupInput ? phoneLookupInput.value.trim() : '+61 400 123 456';
    if (!phone) return;

    try {
      const res = await fetch(`/api/wallet/${encodeURIComponent(phone)}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          const d = json.data;
          currentCustomerWallet.balance = d.walletBalance;
          currentCustomerWallet.name = d.customerName;
          currentCustomerWallet.phone = d.customerPhone;

          const balEl = document.getElementById('walletModalBalance');
          if (balEl) balEl.textContent = `$${d.walletBalance.toFixed(2)}`;

          const nameEl = document.getElementById('walletModalCustName');
          if (nameEl) nameEl.textContent = d.customerName || 'Valued Guest';

          const phEl = document.getElementById('walletModalCustPhone');
          if (phEl) phEl.textContent = d.customerPhone;

          const navPill = document.getElementById('navWalletPill');
          if (navPill) navPill.textContent = `$${d.walletBalance.toFixed(2)}`;

          // Render transaction ledger
          const tbody = document.getElementById('walletLedgerTbody');
          if (tbody) {
            if (!d.recentTransactions || d.recentTransactions.length === 0) {
              tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No wallet transactions yet. Top up credits above to get started!</td></tr>`;
            } else {
              tbody.innerHTML = d.recentTransactions.map(tx => {
                const isTopup = tx.type === 'TOPUP' || tx.type === 'PROMOTION';
                const amtClass = isTopup ? 'text-success' : 'text-warning';
                const sign = isTopup ? '+' : '';
                const dateStr = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
                return `
                  <tr>
                    <td><code>${escapeHtml(tx.transactionRef)}</code></td>
                    <td><span class="badge ${isTopup ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}">${escapeHtml(tx.type)}</span></td>
                    <td class="fw-bold ${amtClass}">${sign}$${Math.abs(tx.amount).toFixed(2)}</td>
                    <td class="text-light">$${tx.balanceAfter.toFixed(2)}</td>
                    <td class="text-secondary">${escapeHtml(tx.description || '')}</td>
                    <td class="text-muted">${dateStr}</td>
                  </tr>
                `;
              }).join('');
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error loading wallet dashboard:', err);
    }
  }

  // Load starter wallet for default guest
  fetchCustomerWallet('+61 400 123 456');
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

function showToast(message, type = 'info', action = null) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-custom ${type} d-flex align-items-center justify-content-between gap-3`;
  
  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check text-success';
  if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation text-danger';

  let actionHtml = '';
  if (action && action.actionText) {
    actionHtml = `<button type="button" class="btn-toast-action" id="toastActionBtn">${action.actionText}</button>`;
  }

  toast.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <i class="${iconClass}"></i>
      <span>${message}</span>
    </div>
    ${actionHtml}
  `;

  container.appendChild(toast);

  if (action && action.onAction) {
    const actionBtn = toast.querySelector('#toastActionBtn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        action.onAction();
        toast.remove();
      });
    }
  }

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}