const qs = require("qs");
const scrapeIt = require("scrape-it");

const response = {
  error: false,
  message: "",
  data: []
};

const index = async (req, res) => {
  let url = null;
  if (req.query.category) {
    url = `https://www.bukalapak.com/c/${req.query.category}`;
  } else {
    url = `https://www.bukalapak.com/products`;
  }

  url = `${url}?${qs.stringify({ "search[keywords]": req.query.keyword })}`;

  if (req.query.sort_by) {
    url = `${url}&${qs.stringify({ "search[sort_by]": req.query.sort_by })}`;
  }

  console.log(url);

  const { data } = await scrapeIt(url, {
    products: {
      listItem: ".product-card",
      data: {
        name: ".product__name",
        price: {
          selector: ".product-price .amount",
          convert(value) {
            return parseInt(value.replace(/\D/g, ""));
          }
        },
        link: {
          selector: ".product-media__link",
          attr: "href",
          convert(value) {
            return `https://www.bukalapak.com${value}`;
          }
        },
        image: {
          selector: ".product-media__img",
          attr: "data-src"
        }
      }
    }
  });
  return res.json({
    products: data.products
      .filter(
        ({ name, price, link, image }) =>
          name.length !== 0 || link.length !== 0 || image.length !== 0
      )
      .map(datum => ({ ...datum, source: "Bukalapak" }))
  });
};

const category = async (req, res) => {
  const { data } = await scrapeIt(`https://www.bukalapak.com/c`, {
    categories: {
      listItem: ".c-panel",
      data: {
        name: ".u-txt--bold",
        value: {
          selector: ".u-fg--black",
          attr: "href",
          convert(value) {
            const val = value.substring(3, value.indexOf("?"));
            return val;
          }
        }
      }
    }
  });
  return res.json({
    ...response,
    data
  });
};

module.exports = {
  index,
  category
};
