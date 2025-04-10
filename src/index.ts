import "./css/style.scss";
import {
  GetDataFuncProps,
  GetDataResponce,
  Product,
} from "./models/Interfaces";
import { http } from "./services/http.service";

document.addEventListener("DOMContentLoaded", () => {
  const loader: HTMLElement = document.querySelector(".loader-content")!;
  const basketIcon: HTMLElement = document.querySelector(".basket-icon")!;
  const basketBlock: HTMLElement = document.querySelector(".basket")!;
  const basketParanja: HTMLElement = document.querySelector(".basket-paranja")!;
  const basketArr: Product[] = [];

  basketParanja.addEventListener("click", () => {
    basketBlock.classList.remove("active");
  });

  basketIcon.addEventListener("click", () => {
    basketBlock.classList.toggle("active");
  });

  getData({ limit: 30 });

  async function getData(params: GetDataFuncProps = {}) {
    try {
      const { data: responce } = await http.get<GetDataResponce>("/products", {
        params,
      });
      renderItems(responce.products);
      addEventsListener(responce.products);
      hideLoader();
    } catch (error) {
      console.log(error);
    }
  }

  function renderItems(products: Product[]) {
    const productsList: HTMLElement | null =
      document.querySelector(".products-list");

    if (productsList) {
      productsList.innerHTML = "";
      products.forEach((product) => {
        const html = generateHTMLMarkUpProductsList(product);
        productsList.insertAdjacentHTML("beforeend", html);
      });
    }
  }

  function addEventsListener(products: Product[]) {
    const productsBtns: NodeListOf<Element> = document.querySelectorAll(
      ".product-add-to-card-btn"
    );

    productsBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        btn.innerHTML = "В корзине";
        btn.classList.add("in-basket");
        addToBasket(products[index]);
      });
    });
  }

  function addToBasket(product: Product) {
    const isExist = basketArr.find((item) => item.id === product.id);

    if (!isExist) {
      basketArr.push({ ...product });
      renderBasketItems();
    }
  }

  function renderBasketItems() {
    const basketRoot: HTMLElement | null =
      document.querySelector(".basket-list");

    if (basketRoot) {
      basketRoot.innerHTML = "";
      basketArr.forEach((item) => {
        const html = generateHTMLMarkUpBasket(item);
        basketRoot.insertAdjacentHTML("beforeend", html);
      });
    }
  }

  function generateHTMLMarkUpBasket(product: Product) {
    let html: string;

    return `
      <li class="basket-list-item">
        <div class="basket-product-photo" style="background-image: url('${
          product.image
        }')"></div>
        <div>
          <p class="basket-product-name">${product.title}</p>
          <p class="basket-product-price">${
            product.discount
              ? (
                  product.price -
                  (product.price * product.discount) / 100
                ).toFixed()
              : product.price
          }$</p>
        </div>
      </li>
    `;
  }

  function generateHTMLMarkUpProductsList(product: Product) {
    let html: string;

    const productItemClasses = product.popular
      ? "product-item hot"
      : "product-item";

    const priceSectionMarkUp = product.discount
      ? `
      <div class="prodct-price discount">
        <p class="prodct-price-item prodct-price-old">${product.price.toFixed()}$</p>
        <p class="prodct-price-item prodct-price-new">${(
          product.price -
          (product.price * product.discount) / 100
        ).toFixed()}$</p>
      </div>
    `
      : `
      <div class="prodct-price">
        <p class="prodct-price-item">${product.price}$</p>
      </div>
    `;

    let isHotMarkUp: string = "";

    if (product.popular) {
      isHotMarkUp = '<div class="product-hot-label">HOT</div>';
    }

    return `
      <li class="${productItemClasses}">
        <div class="product-wrapper">
          <div class="product-image" style="background-image: url('${product.image}')"></div>
          <div class="product-info">
            <h5 class="product-name">
              ${product.title}
            </h5>
            <p class="product-info-item">${product.brand}</p>
            <p class="product-info-item">${product.model}</p>
            <p class="product-info-item">${product.color}</p>
            <p class="product-info-item">${product.category}</p>
          </div>
          <div class="product-buy">
            ${priceSectionMarkUp}
            <button class="product-add-to-card-btn">Купить</button>
          </div>
        </div>
        ${isHotMarkUp}
      </li>
    `;
  }

  function hideLoader() {
    loader.classList.add("hidden");
  }

  function showLoader() {
    loader.classList.remove("hidden");
  }
});
