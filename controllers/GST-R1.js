import { fetchR1 } from "../models/GST-R1.js";

export const getR1Filers = async (req, res, next) => {
  const createTable = (name, desc) => {
    return new Object({
      name: name,
      nor: 0,
      csamt: 0,
      rt: 0,
      txval: 0,
      iamt: 0,
      camt: 0,
      samt: 0,
      desc: desc || "",
    });
  };

  const A4 = createTable(
    "4A",
    "Taxable outward supplies made to registered persons - other than reverse charge supplies"
  );
  const B4 = createTable(
    "4B",
    "Taxable outward supplies made to registered persons attracting tax on reverse charge"
  );
  const C4 = createTable("4C", "Custom Bonded Warehouse");
  const B6 = createTable("6B", "Supplies made to SEZ unit or SEZ developer");
  const C6 = createTable("6C", "Deemed Exports");
  const tables = [A4, B4, C4, B6, C6];

  const feedData = (table, item) => {
    if (item && item["itm_det"]) {
      table.nor++;
      table.csamt += Number.parseFloat(item["itm_det"]["csamt"] || "0.00");
      table.rt += Number.parseFloat(item["itm_det"]["rt"] || "0.00");
      table.txval += Number.parseFloat(item["itm_det"]["txval"] || "0.00");
      table.iamt += Number.parseFloat(item["itm_det"]["iamt"] || "0.00");
      table.camt += Number.parseFloat(item["itm_det"]["camt"] || "0.00");
      table.samt += Number.parseFloat(item["itm_det"]["samt"] || "0.00");
    }
  };

  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const datas = await fetchR1(GSTIN);
      const result = [];
      let nof = datas.length || 0;
      for (let data of datas) {
        if (data) {
          if (data.Id) data.Id = data.Id.toString();
          if (data.FileId) data.FileId = data.FileId.toString();
        }

        if (data.b2b) {
          const parsedData = JSON.parse(data.b2b);

          if (parsedData) {
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
          }
        }
      }

      for (let table of tables) {
        const col = {
          table: table.name,
          numberOfRecords: table.nor,
          numberOfFilingsMadeByGSTIN: nof,
          data: {
            csamt: table.csamt,
            rt: table.rt,
            txval: table.txval,
            iamt: table.iamt,
            camt: table.camt,
            samt: table.samt,
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
