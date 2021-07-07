'use strict';

const headerCityBtn = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

headerCityBtn.textContent = localStorage.getItem('location') || 'Ваш город?';

let hash = location.hash.substring(1);

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
    });
};

// Modal Window

const onEscapePress = (event) => {

    if (event.code === 'Escape') {

        cartOverlay.classList.remove('cart-overlay-open');
        window.removeEventListener('keydown', onEscapePress);
        enableSkroll();
        
    }
};

const onOpenModal = () => {

    cartOverlay.classList.add('cart-overlay-open');
    window.addEventListener('keydown', onEscapePress);
    disableScroll();
};

const onCloseModal = (event) => {
    const target = event.target;
    enableSkroll();

    if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay')) {
        cartOverlay.classList.remove('cart-overlay-open');
        window.removeEventListener('keydown', onEscapePress);
    }
};


// DATABASE FETCH

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Error: ${data.status} ${data.statusText}`);
    }
};

const getGoods = async (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value));
            } else {
                callback(data);
            } 
        })
        .catch(error => {
            console.log(error);
        });
};

// LISTENERS

headerCityBtn.addEventListener('click', () => {
    const city = prompt('Из какого вы города?');
    headerCityBtn.textContent = city;
    localStorage.setItem('location', city);
});

subheaderCart.addEventListener('click', onOpenModal);
cartOverlay.addEventListener('click', onCloseModal);

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page';
    }

    const createCard = ({ id, preview, cost, brand, name, sizes }) => {
        const li = document.createElement('li');

        li.classList.add('goods__item');

        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand}<span class="good__title__grey">/${name}</span></h3>
                    ${sizes ?
                        `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>`
                        : ``}
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
        `;
        return li;
    };

    const renderList = data => {
        goodsList.innerHTML = '';

        data.forEach(element => {
            const card = createCard(element);
            goodsList.append(card);
        });
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);

        getGoods(renderList, hash);
        
        const title = document.querySelector('.goods__title');
        if (hash === 'men') {
            title.textContent = 'Мужчинам';
        } else if (hash === 'women') {
            title.textContent = 'Женщинам';
        } else {
            title.textContent = 'Детям';
        }
    });

} catch (error) {
    console.warn(error);
}