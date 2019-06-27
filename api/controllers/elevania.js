const qs = require("qs");
const scrapeIt = require("scrape-it");

// const response = {
//   error: false,
//   message: "",
//   data: []
// };

const index = async (req, res) => {
  const url = `http://www.elevenia.co.id/search?${qs.stringify({
    q: req.query.keyword
  })}`;

  // if (req.query.sort_by) {
  //   url = `${url}&${qs.stringify({
  //     sortType: req.query.sort_by.includes("asc")
  //       ? "sort_lowprice_asc"
  //       : "sort_lowprice_desc"
  //   })}`;
  // }

  console.log(url);

  const { data } = await scrapeIt(url, {
    products: {
      listItem: ".itemList",
      data: {
        name: ".pordLink",
        price: {
          selector: ".price",
          convert(value) {
            return parseInt(value.replace(/\D/g, ""));
          }
        },
        link: {
          selector: ".pordLink",
          attr: "href"
        },
        image: {
          selector: "img",
          attr: "src"
        }
      }
    }
  });
  let products = data.products
    .filter(
      ({ name, price, link, image }) =>
        name.length !== 0 || link.length !== 0 || image.length !== 0
    )
    .sort((a, b) => a.price - b.price)
    .map(datum => ({ ...datum, source: "Elevania" }));
  if (req.query.sort_by && req.query.sort_by.includes("desc")) {
    products = data.products
      .filter(
        ({ name, price, link, image }) =>
          name.length !== 0 || link.length !== 0 || image.length !== 0
      )
      .sort((a, b) => b.price - a.price)
      .map(datum => ({ ...datum, source: "Elevania" }));
  }
  return res.json({
    products
  });
};

module.exports = {
  index
  // category
};
