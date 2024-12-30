(() => {
  const apiURL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
  const containerClass = ".product-detail";
  const titleText = "You Might Also Like";

  const init = async () => {
    let products;
    if (!localStorage.getItem("productCarouselData")) {
      products = await getProducts();
    } else {
      products = JSON.parse(localStorage.getItem("productCarouselData"));
    }
    if (products) {
      buildCarousel(products);
      buildCSS();
      setEventListeners();
    }
    if (!products) return;
  };

  const getProducts = async () => {
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      localStorage.setItem("productCarouselData", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return null;
    }
  };

  const buildCarousel = (products) => {
    const container = document.querySelector(containerClass);

    const carouselWrapper = document.createElement("div");
    carouselWrapper.className = "carousel-wrapper";

    const title = document.createElement("h2");
    title.textContent = titleText;
    title.className = "carousel-title";
    carouselWrapper.appendChild(title);

    const carousel = document.createElement("div");
    carousel.className = "carousel";

    const carouselInner = document.createElement("div");
    carouselInner.className = "carousel-inner";
    products.forEach((product, index) => {
      const productItem = document.createElement("div");
      productItem.className = "carousel-item";

      const productLink = document.createElement("a");
      productLink.href = product.url;
      productLink.target = "_blank";
      productLink.className = "carousel-link";

      const productImage = document.createElement("img");
      productImage.src = product.img;
      productImage.alt = product.name;

      const productDesc = document.createElement("div");
      const productPrice = document.createElement("p");
      productPrice.textContent = product.price + " TRY";
      productPrice.className = "carousel-price";

      const productName = document.createElement("p");
      productName.textContent = product.name;
      productDesc.className = "carousel-desc";

      const heartIcon = document.createElement("span");
      heartIcon.className = "heart-icon";
      if (getFavoriteStatus(index)) {
        heartIcon.classList.add("favorited");
      }

      heartIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path 
          stroke="blue" 
          stroke-width="1" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      `;

      productDesc.appendChild(productName);
      productDesc.appendChild(productPrice);
      productLink.appendChild(productImage);
      productLink.appendChild(productDesc);
      productItem.appendChild(productLink);
      productItem.appendChild(heartIcon);
      carouselInner.appendChild(productItem);
    });

    carousel.appendChild(carouselInner);

    const leftArrow = document.createElement("button");
    leftArrow.className = "carousel-arrow left";
    leftArrow.textContent = "<";

    const rightArrow = document.createElement("button");
    rightArrow.className = "carousel-arrow right";
    rightArrow.textContent = ">";

    carouselWrapper.appendChild(leftArrow);
    carouselWrapper.appendChild(carousel);
    carouselWrapper.appendChild(rightArrow);

    container.appendChild(carouselWrapper);
  };

  const buildCSS = () => {
    const css = `
        * {
          scroll-behavior: smooth;
        }
        body{
            background-color: rgba(240, 242, 244, 0.631);
        }

        .carousel-wrapper {
            margin-top: 20px;
        }
        
        .carousel-title {
            font-size: 1.5em;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .carousel {
            display: flex;
            overflow: hidden;
            position: relative;
        }
        
        .carousel-inner {
            display: flex;
            transition: transform 0.3s ease-in-out;
        }
        
        .carousel-item {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: calc(100% / 6.5);
          text-align: center;
          margin-right: 7px;
          background-color: white;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .carousel-item:hover {
            transform: scale(1.01);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06);
            cursor: pointer;
        }
      
        .carousel-item img {
            width: 100%;
            height: auto;
            cursor: pointer;
        }
        
        .carousel-desc{
            padding: 7px;
        }

        .carousel-link{
            text-decoration: none;
            color: black;
            text-align: start;
        }
        
        .carousel-price{
            color:blue;
            font-size: 20px;
        }
        
        .carousel-item .heart-icon {
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            text-align: center;
            border-radius: 5px;
            background: #fff;
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
        }

        .heart-icon {
          fill: white;
        }

        .heart-icon.favorited {
            fill: blue;
        }

        .carousel-arrow {
            position: absolute;
            top: 25%;
            transform: translateY(-50%);
            background-color: #000;
            color: #fff;
            border: none;
            padding: 10px;
            cursor: pointer;
            z-index: 1;
        }
    
        .carousel-arrow.left {
            left: 0;
        }
        
        .carousel-arrow.right {
            right: 0;
        }
        
        @media (max-width: 768px) {
            .carousel-item {
                min-width: calc(100% / 3.5);
            }
        }
        
        @media (max-width: 480px) {
            .carousel-item {
                min-width: calc(100% / 2.5);
            }
        }
      `;

    const styleElement = document.createElement("style");
    styleElement.classList.add("carousel-style");
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
  };

  const setEventListeners = () => {
    let carouselContainer = document.querySelector(".carousel");
    const leftArrow = document.querySelector(".carousel-arrow.left");
    const rightArrow = document.querySelector(".carousel-arrow.right");
    leftArrow.addEventListener("click", () => {
      let productWidth =
        document.getElementsByClassName("carousel-item")[0].clientWidth;
      carouselContainer.scrollLeft -= productWidth;
    });

    rightArrow.addEventListener("click", () => {
      let productWidth =
        document.getElementsByClassName("carousel-item")[0].clientWidth;
      carouselContainer.scrollLeft += productWidth;
    });

    document.querySelectorAll(".heart-icon").forEach((icon, index) => {
      icon.addEventListener("click", () => {
        const isFavorited = icon.classList.toggle("favorited");
        setFavoriteStatus(index, isFavorited);
      });
    });
  };

  const getFavoriteStatus = (index) => {
    return JSON.parse(localStorage.getItem(`fav-${index}`)) || false;
  };

  const setFavoriteStatus = (index, isFavorited) => {
    if (isFavorited) {
      localStorage.setItem(`fav-${index}`, true);
    } else {
      localStorage.removeItem(`fav-${index}`);
    }
  };

  init();
})();
