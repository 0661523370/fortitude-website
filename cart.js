document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCart();

        setupCheckout();

    }
);


/* ============================================
   GET CART
============================================ */

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "fortitudeCart"
        )
    ) || [];

}


/* ============================================
   SAVE CART
============================================ */

function saveCart(cart) {

    localStorage.setItem(
        "fortitudeCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


/* ============================================
   DISPLAY CART
============================================ */

function renderCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );

    if (!container) return;


    const cart = getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    YOUR BAG IS EMPTY.
                </h2>

                <p>
                    Discover the latest FORTITUDE pieces.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-dark"
                >
                    SHOP NOW
                </a>

            </div>

        `;

        const checkout =
            document.getElementById(
                "checkoutSection"
            );

        if (checkout) {

            checkout.style.display =
                "none";

        }

        return;

    }


    let total = 0;


    let html = `

        <div class="cart-items">

    `;


    cart.forEach(
        (item, index) => {

            const itemTotal =
                item.price *
                item.quantity;

            total += itemTotal;


            html += `

                <article class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ${item.colour}
                        </p>

                        <p>
                            SIZE: ${item.size}
                        </p>

                        <strong>
                            R${item.price.toFixed(2)}
                        </strong>

                    </div>


                    <div class="cart-controls">

                        <button
                            onclick="changeQuantity(
                                ${index},
                                -1
                            )"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(
                                ${index},
                                1
                            )"
                        >
                            +
                        </button>

                    </div>


                    <div class="cart-item-total">

                        R${itemTotal.toFixed(2)}

                    </div>


                    <button
                        class="remove-item"
                        onclick="removeItem(${index})"
                    >
                        REMOVE
                    </button>

                </article>

            `;

        }
    );


    html += `

        </div>


        <div class="cart-summary">

            <span>
                TOTAL
            </span>

            <strong>
                R${total.toFixed(2)}
            </strong>

        </div>

    `;


    container.innerHTML = html;

}


/* ============================================
   CHANGE QUANTITY
============================================ */

function changeQuantity(
    index,
    change
) {

    const cart = getCart();

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart(cart);

    renderCart();

}


/* ============================================
   REMOVE
============================================ */

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();

}


/* ============================================
   CHECKOUT
============================================ */

function setupCheckout() {

    const form =
        document.getElementById(
            "checkoutForm"
        );

    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const cart = getCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            const name =
                document.getElementById(
                    "customerName"
                ).value;

            const email =
                document.getElementById(
                    "customerEmail"
                ).value;

            const phone =
                document.getElementById(
                    "customerPhone"
                ).value;

            const address =
                document.getElementById(
                    "customerAddress"
                ).value;


            let order =
                "FORTITUDE ORDER%0D%0A%0D%0A";


            let total = 0;


            cart.forEach(item => {

                const itemTotal =
                    item.price *
                    item.quantity;

                total += itemTotal;


                order +=

                    `${item.name}%0D%0A` +

                    `Size: ${item.size}%0D%0A` +

                    `Colour: ${item.colour}%0D%0A` +

                    `Quantity: ${item.quantity}%0D%0A` +

                    `Price: R${itemTotal.toFixed(2)}%0D%0A%0D%0A`;

            });


            order +=

                `TOTAL: R${total.toFixed(2)}%0D%0A%0D%0A` +

                `CUSTOMER DETAILS%0D%0A` +

                `Name: ${name}%0D%0A` +

                `Email: ${email}%0D%0A` +

                `Phone: ${phone}%0D%0A` +

                `Address: ${address}`;


            const mailto =

                `mailto:fortitude@example.com` +

                `?subject=${encodeURIComponent(
                    "New FORTITUDE Order"
                )}` +

                `&body=${order}`;


            window.location.href =
                mailto;


            /*
                We clear the cart after
                opening the email client.
            */

            localStorage.removeItem(
                "fortitudeCart"
            );

        }
    );

}