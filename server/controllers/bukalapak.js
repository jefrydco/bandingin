import scrapeIt from "scrape-it";

const response = {
  error: false,
  message: "",
  data: []
};

const index = async (req, res) => {
  const { data } = await scrapeIt(
    `https://www.bukalapak.com/products?keywords=${req.query.keyword}`,
    {
      products: {
        listItem: ".product-card",
        data: {
          name: ".product__name",
          price: ".product-price .amount",
          link: {
            selector: ".product-media__link",
            attr: "href"
          },
          image: {
            selector: ".product-media__img",
            attr: "data-src"
          }
        }
      }
    }
  );
  return res.json({
    ...response,
    data
  });
};

export default {
  index
};
