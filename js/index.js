const headerCityBtn = document.querySelector('.header__city-button');

headerCityBtn.textContent = localStorage.getItem('location') || 'Ваш город?';

headerCityBtn.addEventListener('click', () => {
    const city = prompt('Из какого вы города?');
    headerCityBtn.textContent = city;
    localStorage.setItem('location', city);
});

// Block Skroll

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;

    document.body.dbScrollY = window.scrollY;

    document.body.style.cssText = `
        position: fixed;
        width: 100%;
        height: 100vh;
        left: 0;
        top: ${-window.scrollY}px;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;
};

const enableSkroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
};

// Modal Window

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const onOpenModal = () => {
    cartOverlay.classList.add('cart-overlay-open');
    window.addEventListener('keydown', onEscapePress);
    disableScroll();
};

const onCloseModal = (event) => {
    const target = event.target;
    enableSkroll();

    if (target.classList.contains('cart__btn-close')
        || target.classList.contains('cart-overlay')) {
        cartOverlay.classList.remove('cart-overlay-open');
        window.removeEventListener('keydown', onEscapePress);
    }
};

const onEscapePress = (event) => {


    if (event.code === 'Escape') {
        cartOverlay.classList.remove('cart-overlay-open');
        window.removeEventListener('keydown', onEscapePress);
        enableSkroll();
    }
};

subheaderCart.addEventListener('click', onOpenModal);
cartOverlay.addEventListener('click', onCloseModal);
