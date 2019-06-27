const qs = require("qs");
const scrapeIt = require("scrape-it");

// const response = {
//   error: false,
//   message: "",
//   data: []
// };

const index = async (req, res) => {
  let url = null;
  if (req.query.category) {
    url = `https://www.jd.id/search/?${qs.stringify({
      categoryName: req.query.category,
      keywords: req.query.keyword
    })}`;
  } else {
    url = `https://www.jd.id/search?${qs.stringify({
      keywords: req.query.keyword
    })}`;
  }

  if (req.query.sort_by) {
    url = `${url}&${qs.stringify({
      sortType: req.query.sort_by.includes("asc")
        ? "sort_lowprice_asc"
        : "sort_lowprice_desc"
    })}`;
  }

  console.log(url);

  const { data } = await scrapeIt(url, {
    products: {
      listItem: ".item",
      data: {
        name: ".name",
        price: {
          selector: ".p-price span[eptid='price']",
          convert(value) {
            return parseInt(value.replace(/\D/g, ""));
          }
        },
        link: {
          selector: ".name",
          attr: "href"
        },
        image: {
          selector: ".ui-switchable-imgscroll-img",
          attr: "src"
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
      .map(datum => ({ ...datum, source: "JD.id" }))
  });
};

// const category = async (req, res) => {
//   const { data } = await scrapeIt(`https://www.bukalapak.com/c`, {
//     categories: {
//       listItem: ".c-panel",
//       data: {
//         name: ".u-txt--bold",
//         value: {
//           selector: ".u-fg--black",
//           attr: "href",
//           convert(value) {
//             const val = value.substring(3, value.indexOf("?"));
//             return val;
//           }
//         }
//       }
//     }
//   });
//   return res.json({
//     ...response,
//     data
//   });
// };

module.exports = {
  index
  // category
};
