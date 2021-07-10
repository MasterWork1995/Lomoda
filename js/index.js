'use strict';

const headerCityBtn = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartListGoogs = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');

headerCityBtn.textContent = localStorage.getItem('location') || 'Ваш город?';

let hash = location.hash.substring(1);

// LOCAL STORAGE
const getLocalStorage = () => JSON?.parse(localStorage.getItem('card-lomoda')) || [];
const setLocalStorage = data => localStorage.setItem('card-lomoda', JSON.stringify(data));

// BASKET
const renderCart = () => {
    cartListGoogs.textContent = '';
    const cartItems = getLocalStorage();
    let totalPrice = 0;

    cartItems.forEach((item, i) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${item.brand} ${item.name}</td>
            ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
            ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
            <td>${item.cost} &#8372;</td>
            <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
        `;

        totalPrice += item.cost;
        cartListGoogs.append(tr);
    });
    cartTotalCost.textContent = totalPrice +  ' ₴';
};

const deleteItemCard = (id) => {
    const cartItem = getLocalStorage();
    const newCartItems = cartItem.filter(item => item.id !== id);
    setLocalStorage(newCartItems);
};

cartListGoogs.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        deleteItemCard(e.target.dataset.id);
        renderCart();
    }
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
    renderCart();
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

const getGoods = async (callback, prop, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item[prop] === value));
            } else {
                callback(data);
            } 
        })
        .catch(error => {
            console.log(error);
        });
};

// GOODS
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
                    <p class="good__price">${cost} &#8372</p>
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

    const changeTitle = () => {
        const title = document.querySelector('.goods__title');
        title.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;

        // if (hash === 'men') {
        //     title.textContent = 'Мужчинам';
        // } else if (hash === 'women') {
        //     title.textContent = 'Женщинам';
        // } else {
        //     title.textContent = 'Детям';
        // }
    };

    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1);
        changeTitle();
        getGoods(renderList, 'category', hash);
    });

    changeTitle();
    getGoods(renderList, 'category', hash);

} catch (error) {
    console.warn(error);
}

// GOOD PAGE
try {
    if (!document.querySelector('.card-good')) {
        throw 'This is not a card-good page';
    }

    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price');
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
    const cardGoodColorList = document.querySelector('.card-good__color-list');
    const cardGoodSizes = document.querySelector('.card-good__sizes');
    const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
    const cardGoodBuy = document.querySelector('.card-good__buy');

    const generateList = data => data.reduce((acc, item, i) => acc +
        `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

    const renderCardGood = ([{ id, brand, name, cost, color, sizes, photo }]) => {

        const data = { brand, cost, id, name };

        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${brand} ${name}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent = name;
        cardGoodPrice.textContent = `${cost} ₴`;
        if (color) {
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0;
            cardGoodColorList.innerHTML = generateList(color);
        } else {
            cardGoodColor.style.display = 'none';
        }
        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizesList.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        } else {
            cardGoodSizes.style.display = 'none';
        }

        if (getLocalStorage().some(item => item.id === id)) {
            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';
        }

        cardGoodBuy.addEventListener('click', () => {
            if (cardGoodBuy.classList.contains('delete')) {
                deleteItemCard(id);
                cardGoodBuy.classList.remove('delete');
                cardGoodBuy.textContent = 'Добавить в корзину';
                return;
            }
            if (color) {
                data.color = cardGoodColor.textContent;
            }
            if (sizes) {
                data.size = cardGoodSizes.textContent;
            }

            cardGoodBuy.classList.add('delete');
            cardGoodBuy.textContent = 'Удалить из корзины';
            
            const cardDate = getLocalStorage();
            cardDate.push(data);
            setLocalStorage(cardDate);
        });
    };

    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open');
            }

            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        });
    });



    getGoods(renderCardGood, 'id', hash);
    
} catch (error) {
    console.warn(error);
}

// LISTENERS
headerCityBtn.addEventListener('click', () => {
    const city = prompt('Из какого вы города?');
    headerCityBtn.textContent = city;
    localStorage.setItem('location', city);
});
subheaderCart.addEventListener('click', onOpenModal);
cartOverlay.addEventListener('click', onCloseModal);