import { fetchR1 } from "../models/GST-R1.js";

export const getR1Filers = async (req, res, next) => {
  const createTable = (name, desc) => {
    return new Object({
      name: name,
      csamt: 0,
      rt: 0,
      txval: 0,
      iamt: 0,
      desc: desc || "",
    });
  };

  const A4 = createTable(
    "A4",
    "Taxable outward supplies made to registered persons - other than reverse charge supplies"
  );
  const B4 = createTable(
    "B4",
    "Taxable outward supplies made to registered persons attracting tax on reverse charge"
  );
  const C4 = createTable("C4", "Custom Bonded Warehouse");
  const B6 = createTable("B6", "Supplies made to SEZ unit or SEZ developer");
  const C6 = createTable("C6", "Deemed Exports");
  const tables = [A4, B4, C4, B6, C6];

  const feedData = (table, item) => {
    if (item && item["itm_det"]) {
      table.csamt += Number.parseFloat(item["itm_det"]["csamt"] || "0.00");
      table.rt += Number.parseFloat(item["itm_det"]["rt"] || "0.00");
      table.txval += Number.parseFloat(item["itm_det"]["txval"] || "0.00");
      table.iamt += Number.parseFloat(item["itm_det"]["iamt"] || "0.00");
    }
  };

  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchR1(GSTIN);
      if (data) {
        if (data.Id) data.Id = data.Id.toString();
        if (data.FileId) data.FileId = data.FileId.toString();
      }
      const parsedData = JSON.parse(data.b2b);

      for (let sub of parsedData) {
        for (let inv of sub["inv"]) {
          for (let item of inv["itms"]) {
            if (item) {
              if (inv["inv_typ"] == "R" && inv["rchrg"] == "N") {
                // Taxable outward supplies made to registered persons - other than reverse charge supplies
                feedData(A4, item);
              } else if (inv["inv_typ"] == "R" && inv["rchrg"] != "N") {
                // Taxable outward supplies made to registered persons attracting tax on reverse charge
                feedData(B4, item);
              } else if (
                inv["inv_typ"] == "SEWP" ||
                inv["inv_typ"] == "SEWOP"
              ) {
                //  Supplies made to SEZ unit or SEZ developer
                feedData(B6, item);
              } else if (inv["inv_typ"] == "DE") {
                // Deemed Exports
                feedData(C6, item);
              } else if (inv["inv_typ"] == "CBW") {
                // Custom Bonded Warehouse
                feedData(C4, item);
              }
            }
          }
        }
      }

      const result = [];
      for (let table of tables) {
        const col = {
          table: table.name,
          data: {
            csamt: table.csamt,
            rt: table.rt,
            txval: table.txval,
            iamt: table.iamt,
          },
          desc: table.desc,
        };

        result.push(col);
      }

      res.status(200).send({
        message: "Data fetched successfully",
        data: result,
        error: null,
      });
    } catch (e) {
      console.log(e.message);
      res.status(500).send({
        message: "An error occured",
        data: null,
        error: e.message,
      });
    }
  } else {
    res.status(400).send({
      message: "Please provide a valid GSTIN",
      data: null,
      error: null,
    });
  }
};
