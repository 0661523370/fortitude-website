document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    setupMobileMenu();

    setupNewsletter();

    setupContactForm();


    if (document.getElementById("featured-products")) {

        displayFeaturedProducts();

    }


    if (document.getElementById("shop-products")) {

        setupShop();

    }


    if (document.getElementById("productDetail")) {

        displayProduct();

    }

});


/* ============================================
   CART COUNT
============================================ */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("fortitudeCart")
        ) || [];


    const countElement =
        document.getElementById("cart-count");


    if (!countElement) return;


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    countElement.textContent =
        total;

}


/* ============================================
   MOBILE MENU
============================================ */

function setupMobileMenu() {

    const button =
        document.getElementById("menuBtn");


    const navigation =
        document.getElementById("navLinks");


    if (!button || !navigation) return;


    button.addEventListener(
        "click",
        () => {

            navigation.classList.toggle("open");

        }
    );

}


/* ============================================
   PRODUCT HELPERS
============================================ */

function getProductImages(product) {

    if (
        Array.isArray(product.images) &&
        product.images.length > 0
    ) {

        return product.images;

    }


    return [
        {
            colour:
                product.colour || "Default",

            image:
                product.image
        }
    ];

}


function getProductColours(product) {

    if (
        Array.isArray(product.colours) &&
        product.colours.length > 0
    ) {

        return product.colours;

    }


    if (product.colour) {

        return [product.colour];

    }


    return [];

}


/* ============================================
   PRODUCT CARD
============================================ */

function createProductCard(product) {

    const colours =
        getProductColours(product);


    const displayColour =
        colours.join(" / ");


    const firstImage =
        getProductImages(product)[0];


    return `

        <article class="product-card">

            <a
                href="product.html?id=${product.id}"
                class="product-image"
            >

                <img
                    src="${firstImage.image}"
                    alt="${product.name}"
                >

                ${
                    product.newArrival
                    ?
                    `<span class="product-tag">
                        NEW
                    </span>`
                    :
                    ""
                }

            </a>


            <div class="product-info">

                <div>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${displayColour}
                    </p>

                </div>


                <strong>
                    R${product.price.toFixed(2)}
                </strong>

            </div>

        </article>

    `;

}


/* ============================================
   FEATURED PRODUCTS
============================================ */

function displayFeaturedProducts() {

    const container =
        document.getElementById(
            "featured-products"
        );


    if (!container) return;


    const featured =
        products.slice(0, 4);


    container.innerHTML =
        featured
            .map(createProductCard)
            .join("");

}


/* ============================================
   SHOP
============================================ */

function setupShop() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    const colourFilter =
        document.getElementById(
            "colourFilter"
        );


    const sizeFilter =
        document.getElementById(
            "sizeFilter"
        );


    const sortFilter =
        document.getElementById(
            "sortFilter"
        );


    if (
        !searchInput ||
        !categoryFilter ||
        !colourFilter ||
        !sizeFilter ||
        !sortFilter
    ) {
        return;
    }


    function filterProducts() {

        let filtered =
            [...products];


        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        /* SEARCH */

        if (search) {

            filtered =
                filtered.filter(product => {

                    const colours =
                        getProductColours(product)
                            .join(" ")
                            .toLowerCase();


                    return (

                        product.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        product.category
                            .toLowerCase()
                            .includes(search)

                        ||

                        colours
                            .includes(search)

                        ||

                        product.description
                            .toLowerCase()
                            .includes(search)

                    );

                });

        }


        /* CATEGORY */

        if (
            categoryFilter.value !== "all"
        ) {

            filtered =
                filtered.filter(
                    product =>
                        product.category ===
                        categoryFilter.value
                );

        }


        /* COLOUR */

        if (
            colourFilter.value !== "all"
        ) {

            filtered =
                filtered.filter(product =>
                    getProductColours(product)
                        .includes(
                            colourFilter.value
                        )
                );

        }


        /* SIZE */

        if (
            sizeFilter.value !== "all"
        ) {

            filtered =
                filtered.filter(product =>
                    product.sizes.includes(
                        sizeFilter.value
                    )
                );

        }


        /* SORT */

        if (
            sortFilter.value === "low"
        ) {

            filtered.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        if (
            sortFilter.value === "high"
        ) {

            filtered.sort(
                (a, b) =>
                    b.price - a.price
            );

        }


        if (
            sortFilter.value === "new"
        ) {

            filtered.sort(
                (a, b) =>
                    Number(b.newArrival) -
                    Number(a.newArrival)
            );

        }


        displayShopProducts(
            filtered
        );

    }


    searchInput.addEventListener(
        "input",
        filterProducts
    );


    categoryFilter.addEventListener(
        "change",
        filterProducts
    );


    colourFilter.addEventListener(
        "change",
        filterProducts
    );


    sizeFilter.addEventListener(
        "change",
        filterProducts
    );


    sortFilter.addEventListener(
        "change",
        filterProducts
    );


    document
        .querySelectorAll(
            ".sidebar-filter"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".sidebar-filter"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );


                    button.classList.add(
                        "active"
                    );


                    categoryFilter.value =
                        button.dataset.category;


                    filterProducts();

                }
            );

        });


    filterProducts();

}


/* ============================================
   DISPLAY SHOP PRODUCTS
============================================ */

function displayShopProducts(list) {

    const container =
        document.getElementById(
            "shop-products"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (!container) return;


    if (resultCount) {

        resultCount.textContent =
            `${list.length} PRODUCTS`;

    }


    if (list.length === 0) {

        container.innerHTML = `

            <div class="no-results">

                <h2>
                    NO PRODUCTS FOUND.
                </h2>

                <p>
                    Try another search or filter.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        list
            .map(createProductCard)
            .join("");

}


/* ============================================
   PRODUCT PAGE
============================================ */

function displayProduct() {

    const container =
        document.getElementById(
            "productDetail"
        );


    const parameters =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        Number(
            parameters.get("id")
        );


    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        container.innerHTML = `

            <div class="no-results">

                <h2>
                    PRODUCT NOT FOUND
                </h2>

                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    RETURN TO SHOP
                </a>

            </div>

        `;

        return;

    }


    const productImages =
        getProductImages(product);


    container.innerHTML = `

        <div class="product-detail-image">

            <div class="product-slider">

                <button
                    class="slider-arrow slider-prev"
                    id="prevImage"
                    type="button"
                    aria-label="Previous colour"
                >
                    ←
                </button>


                <div
                    class="slider-track"
                    id="sliderTrack"
                >
                </div>


                <button
                    class="slider-arrow slider-next"
                    id="nextImage"
                    type="button"
                    aria-label="Next colour"
                >
                    →
                </button>

            </div>


            <div
                class="slider-dots"
                id="sliderDots"
            >
            </div>


            <div
                class="slider-colour"
                id="sliderColour"
            >
                ${productImages[0].colour}
            </div>

        </div>


        <div class="product-detail-info">

            <span class="section-number">

                FORTITUDE /
                ${product.category}

            </span>


            <h1>
                ${product.name}
            </h1>


            <div class="detail-price">
                R${product.price.toFixed(2)}
            </div>


            <p class="detail-description">

                ${product.description}

            </p>


            <div class="product-option">

                <label>
                    COLOUR
                </label>

                <strong
                    id="selectedProductColour"
                >
                    ${productImages[0].colour}
                </strong>

            </div>


            <div class="product-option">

                <label>
                    SIZE
                </label>

                <div class="size-buttons">

                    ${
                        product.sizes
                            .map(
                                size => `

                                    <button
                                        type="button"
                                        class="size-button"
                                        data-size="${size}"
                                    >
                                        ${size}
                                    </button>

                                `
                            )
                            .join("")
                    }

                </div>

            </div>


            <div class="product-option">

                <label>
                    QUANTITY
                </label>

                <div class="quantity-control">

                    <button
                        id="minusQuantity"
                        type="button"
                    >
                        −
                    </button>


                    <span id="quantity">
                        1
                    </span>


                    <button
                        id="plusQuantity"
                        type="button"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="btn btn-dark add-product"
                id="addProduct"
                type="button"
            >
                ADD TO CART
            </button>


            <div
                class="product-message"
                id="productMessage"
            >
            </div>

        </div>

    `;


    /* ========================================
       SIZE
    ======================================== */

    let selectedSize =
        product.sizes[0];


    let quantity =
        1;


    document
        .querySelectorAll(
            ".size-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".size-button"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "selected"
                            )
                        );


                    button.classList.add(
                        "selected"
                    );


                    selectedSize =
                        button.dataset.size;

                }
            );

        });


    const firstSizeButton =
        document.querySelector(
            ".size-button"
        );


    if (firstSizeButton) {

        firstSizeButton.classList.add(
            "selected"
        );

    }


    /* ========================================
       QUANTITY
    ======================================== */

    const quantityDisplay =
        document.getElementById(
            "quantity"
        );


    document
        .getElementById(
            "minusQuantity"
        )
        .addEventListener(
            "click",
            () => {

                if (quantity > 1) {

                    quantity--;

                    quantityDisplay.textContent =
                        quantity;

                }

            }
        );


    document
        .getElementById(
            "plusQuantity"
        )
        .addEventListener(
            "click",
            () => {

                quantity++;

                quantityDisplay.textContent =
                    quantity;

            }
        );


    /* ========================================
       SLIDER
    ======================================== */

    setupProductSlider(
        product
    );


    /* ========================================
       ADD TO CART
    ======================================== */

    document
        .getElementById(
            "addProduct"
        )
        .addEventListener(
            "click",
            () => {

                const slider =
                    window.fortitudeProductSlider;


                let selectedImage =
                    productImages[0].image;


                let selectedColour =
                    productImages[0].colour;


                if (slider) {

                    selectedImage =
                        slider.getSelectedImage();

                    selectedColour =
                        slider.getSelectedColour();

                }


                addToCart(
                    product,
                    selectedSize,
                    quantity,
                    selectedColour,
                    selectedImage
                );


                const message =
                    document.getElementById(
                        "productMessage"
                    );


                message.textContent =
                    "✓ ADDED TO CART";


                updateCartCount();

            }
        );

}


/* ============================================
   PRODUCT SLIDER
============================================ */

function setupProductSlider(product) {

    const track =
        document.getElementById(
            "sliderTrack"
        );


    const dots =
        document.getElementById(
            "sliderDots"
        );


    const colourText =
        document.getElementById(
            "sliderColour"
        );


    const selectedColourText =
        document.getElementById(
            "selectedProductColour"
        );


    const previousButton =
        document.getElementById(
            "prevImage"
        );


    const nextButton =
        document.getElementById(
            "nextImage"
        );


    if (
        !track ||
        !dots ||
        !colourText ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }


    const images =
        getProductImages(product);


    let currentIndex =
        0;


    /* ========================================
       CREATE SLIDES
    ======================================== */

    track.innerHTML = "";


    images.forEach(
        (item, index) => {

            const slide =
                document.createElement(
                    "div"
                );


            slide.className =
                "slider-slide";


            slide.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${product.name} - ${item.colour}"
                    draggable="false"
                >

            `;


            track.appendChild(
                slide
            );

        }
    );


    /* ========================================
       CREATE DOTS
    ======================================== */

    dots.innerHTML = "";


    images.forEach(
        (item, index) => {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type =
                "button";


            dot.className =
                "slider-dot";


            dot.setAttribute(
                "aria-label",
                `View ${item.colour}`
            );


            dot.addEventListener(
                "click",
                () => {

                    goToSlide(
                        index
                    );

                }
            );


            dots.appendChild(
                dot
            );

        }
    );


    const dotButtons =
        dots.querySelectorAll(
            ".slider-dot"
        );


    /* ========================================
       GO TO SLIDE
    ======================================== */

    function goToSlide(index) {

        if (index < 0) {

            index =
                images.length - 1;

        }


        if (
            index >= images.length
        ) {

            index =
                0;

        }


        currentIndex =
            index;


        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;


        dotButtons.forEach(
            (dot, dotIndex) => {

                dot.classList.toggle(
                    "active",
                    dotIndex === currentIndex
                );

            }
        );


        const currentColour =
            images[currentIndex].colour;


        colourText.textContent =
            currentColour;


        if (selectedColourText) {

            selectedColourText.textContent =
                currentColour;

        }

    }


    /* ========================================
       BUTTONS
    ======================================== */

    previousButton.addEventListener(
        "click",
        () => {

            goToSlide(
                currentIndex - 1
            );

        }
    );


    nextButton.addEventListener(
        "click",
        () => {

            goToSlide(
                currentIndex + 1
            );

        }
    );


    /* ========================================
       TOUCH SWIPE
    ======================================== */

    let touchStartX =
        0;


    let touchEndX =
        0;


    track.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    track.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) < 50
            ) {
                return;
            }


            if (distance < 0) {

                goToSlide(
                    currentIndex + 1
                );

            } else {

                goToSlide(
                    currentIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );


    /* ========================================
       SAVE SLIDER DATA
    ======================================== */

    window.fortitudeProductSlider = {

        getSelectedImage() {

            return images[
                currentIndex
            ].image;

        },


        getSelectedColour() {

            return images[
                currentIndex
            ].colour;

        }

    };


    /* START */

    goToSlide(0);

}


/* ============================================
   ADD TO CART
============================================ */

function addToCart(
    product,
    size,
    quantity,
    selectedColour,
    selectedImage
) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "fortitudeCart"
            )
        ) || [];


    const existing =
        cart.find(
            item =>
                item.id === product.id &&
                item.size === size &&
                item.colour === selectedColour
        );


    if (existing) {

        existing.quantity +=
            quantity;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            size:
                size,

            colour:
                selectedColour,

            image:
                selectedImage,

            quantity:
                quantity

        });

    }


    localStorage.setItem(
        "fortitudeCart",
        JSON.stringify(cart)
    );

}


/* ============================================
   NEWSLETTER
============================================ */

function setupNewsletter() {

    const form =
        document.getElementById(
            "newsletterForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            alert(
                "Thank you for joining FORTITUDE."
            );


            form.reset();

        }
    );

}


/* ============================================
   CONTACT
============================================ */

function setupContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                ).value;


            const email =
                document.getElementById(
                    "contactEmail"
                ).value;


            const subject =
                document.getElementById(
                    "contactSubject"
                ).value;


            const message =
                document.getElementById(
                    "contactMessage"
                ).value;


            const body =

                `Name: ${name}%0D%0A` +

                `Email: ${email}%0D%0A%0D%0A` +

                `${message}`;


            window.location.href =
                `mailto:fortitude@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        }
    );

}