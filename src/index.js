const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];
const { products } = require("./data/products.json");

function porId(ids, productsList) {
  return productsList.filter((e) => {
    if (ids.includes(e.id)) {
      return e;
    }
  });
}

function pegaPreco(products) {
  return products.map(({ regularPrice }) => regularPrice);
}

function pegaNomeCategoria(products) {
  return products.map(({ name, category }) => ({ name, category }));
}

function pegaCategoria(productsList) {
  return [...new Set(productsList.map((product) => product.category))];
}

function pegaPromocoes(categories) {
  return promotions[categories.length - 1];
}

function calculaDesconto(products, promotion) {
  return products.map(({ promotions, regularPrice }) => {
    const productPromotions = promotions || [];
    const inPromotion =
      productPromotions.find(({ looks }) => looks.includes(promotion)) || {};
    return inPromotion.price || regularPrice;
  });
}

function getShoppingCart(ids, productsList) {
  const products = porId(ids, productsList);
  const categories = pegaCategoria(products);
  const promotion = pegaPromocoes(categories);
  const prices = pegaPreco(products);
  const discountedPrices = calculaDesconto(products, promotion);

  const sum = (total, value) => total + value;
  const format = (value) => value.toFixed(2);

  const price = prices.reduce(sum, 0);
  const discountedPrice = discountedPrices.reduce(sum, 0);
  const discountValue = price - discountedPrice;
  const discountPercent = 100 - (100 * discountedPrice) / price;

  return {
    products: pegaNomeCategoria(products),
    promotion: promotion,
    totalPrice: format(discountedPrice),
    discountValue: format(discountValue),
    discount: `${format(discountPercent)}%`,
  };
}

module.exports = { getShoppingCart };
