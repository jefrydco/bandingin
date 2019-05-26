import scrapeIt from "scrape-it";

// eslint-disable-next-line
const response = {
  error: false,
  message: "",
  data: []
};

const index = async (req, res) => {
  try {
    const resp = await scrapeIt(
      `https://www.lazada.co.id/catalog/?q=${req.query.keyword}`,
      {
        products: {
          listItem: "script"
        }
      }
    );
    const pageData = resp.data.products[2].replace("window.pageData=", "");
    console.log(pageData);
    // console.log(pageData.mods.listItems);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(200);
  }
  // console.log(resp.$("script[type='application/ld+json']").html());
  // return res.json({
  //   ...response,
  //   data: resp.data
  // });
};

export default {
  index
};
