const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");

const productResult = document.querySelector("#product-result");

let products = [];

async function getProducts() {
    productResult.innerText= "Loading Products...";

    try {
        const response = await fetch("https://dummyjson.com/products");

        if(!response.ok) {
            throw new Error("Failed to get products");
        }

        const data = await response.json();
        products = data.products;

        const categories = products.map((product) => {
            return product.category;
        })

        const uniqueCategories = [...new Set(categories)];

        uniqueCategories.forEach((category) => {
            const option = document.createElement("option");

            option.innerText = category;

            categoryFilter.append(option);
        });

        renderProducts(products);
    } catch(error) {
        productResult.innerText = "Failed to load products";
        console.log(error.message);
    }
}

getProducts();

function renderProduct(product) {
    const heading = document.createElement("h3");
    const price = document.createElement("p");
    const image = document.createElement("img");
    const categoryText = document.createElement("p");
    const descriptionText = document.createElement("p");
    const newDiv = document.createElement("div");

    newDiv.classList.add("product-card");

    heading.innerText = product.title;
    price.innerText = `$${product.price}`;
    image.src = product.thumbnail;
    image.alt = product.title;
    categoryText.innerText = product.category;
    descriptionText.innerText = product.description;

    newDiv.append(image);
    newDiv.append(heading);
    newDiv.append(price);
    newDiv.append(categoryText);
    newDiv.append(descriptionText);
    productResult.append(newDiv);
}

function renderProducts(productsToRender) {
    productResult.innerHTML = "";

    productsToRender.forEach((product) => {
      renderProduct(product);
    })
}

function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortFilter.value;

    const filteredProducts = products.filter((product) => {
    const matchesSearch = 
        product.title.toLowerCase().includes(searchText) ||
        product.category.toLowerCase().includes(searchText);
        
    const matchesCategory = 
        selectedCategory === "" ||
        selectedCategory === product.category;
        
    return matchesSearch && matchesCategory;
    });

    if (sortOrder === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if(sortOrder === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if(filteredProducts.length === 0) {
        productResult.innerText = "No matching products."
    } else {
        renderProducts(filteredProducts);
    }
}

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

sortFilter.addEventListener("change", filterProducts);

