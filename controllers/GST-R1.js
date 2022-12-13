import { fetchR1 } from "../models/GST-R1.js";

export const getR1Filers = async (req, res, next) => {
  const createTable = (name, desc) => {
    return new Object({
      name: name,
      numberOfRecords: 0,
      csamt: 0,
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

  const B9_1 = createTable("9B_1", "Credit/Debit Notes (Registered)");
  const B9_2 = createTable("9B_2", "Credit/Debit Notes (Unregistered)");
  const A6 = createTable("6A", "Exports (with/without payment)");
  const A9_1 = createTable("9A_1", "Amendment to taxable outward supplies - B2B Regular");
  const A9_2 = createTable("9A_2", "Amendment to taxable outward supplies - B2B Reverse charge");
  const A9_3 = createTable("9A_3", "Amendment to Inter-State supplies B2CL (Large)");
  const A9_4 = createTable("9A_4", "Amendment to Export supplies");
  const A9_5 = createTable("9A_5", "Amendment to supplies made to SEZ");
  const A9_6 = createTable("9A_6", "Amendment to Deemed Exports");
  const C9_1 = createTable("9C_1", "Amended Credit/Debit Notes (Registered)");
  const C9_2 = createTable("9C_2", "Amended Credit/Debit Notes (Unregistered)");

  B9_2.B2CL = createTable('B2CL', 'B2CL');
  B9_2.EXPWP = createTable('EXPWP', 'EXPWP');
  B9_2.EXPWOP = createTable('EXPWOP', 'EXPWOP');

  const tables = [
    A4, B4, C4, B6, C6,
    B9_1, B9_2, A6, A9_1, A9_2, A9_3, A9_4, A9_5, A9_6, C9_1, C9_2
  ];

  const feedData = (table, item) => {
    if (item && item["itm_det"]) {
      table.numberOfRecords++;
      table.csamt += Number.parseFloat(item["itm_det"]["csamt"] || "0.00");
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
      const result = {};
      let numberOfFilingsMadeByGSTIN = datas.length || 0;
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
                      // Supplies made to SEZ unit or SEZ developer
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

        if (data.CreditandDebitNote) {
          const parsedData = JSON.parse(data.CreditandDebitNote);
          if (parsedData && parsedData.length) {
            for (let data of parsedData) {
              const notes = data['nt'];   // array of notes
              for (let note of notes) {
                // Credit/Debit Notes (Registered)
                feedData(B9_1, note.itms[0]);
              }
            }
          }
        }

        if (data.CreditAndDebitNoteForUnregistered) {
          const parsedData = JSON.parse(data.CreditAndDebitNoteForUnregistered);
          if (parsedData && parsedData.length) {
            for (let note of parsedData) {
              // Credit/Debit Notes (Unregistered)
              if (note.typ == 'B2CL') {
                feedData(B9_2.B2CL, note.itms[0]);
              } else if (note.typ == 'EXPWP') {
                feedData(B9_2.EXPWP, note.itms[0]);
              } else if (note.typ == 'EXPWOP') {
                feedData(B9_2.EXPOP, note.itms[0]);
              }
            }
          }
        }

        if (data.b2ba) {
          const parsedData = JSON.parse(data.b2ba);

          if (parsedData) {
            for (let sub of parsedData) {
              for (let inv of sub["inv"]) {
                for (let item of inv["itms"]) {
                  if (item) {
                    if (inv["inv_typ"] == "R" && inv["rchrg"] == "N") {
                      // Taxable outward supplies made to registered persons - other than reverse charge supplies
                      feedData(A9_1, item);
                    } else if (inv["inv_typ"] == "R" && inv["rchrg"] != "N") {
                      // Taxable outward supplies made to registered persons attracting tax on reverse charge
                      feedData(A9_2, item);
                    } else if (
                      inv["inv_typ"] == "SEWP" || inv["inv_typ"] == "SEWOP"
                    ) {
                      // Supplies made to SEZ unit or SEZ developer
                      feedData(A9_5, item);
                    } else if (inv["inv_typ"] == "DE") {
                      // Deemed Exports
                      feedData(A9_6, item);
                    } else if (inv["inv_typ"] == "CBW") {
                      // Custom Bonded Warehouse
                      // ⚠️TODO - CBW mentioned attributes excel but not present in GSTR1 form⚠️
                      // feedData(?, item);
                    }
                    // ⚠️TODO - A9_3, A9_4⚠️
                  }
                }
              }
            }
          }
        }



      }

      result.numberOfFilingsMadeByGSTIN = numberOfFilingsMadeByGSTIN;
      for (let table of tables) {
        result['table' + table.name] = table;
      }

      res.status(200).send({
        message: "Data fetched successfully",
        data: result,
        error: null,
      });
    } catch (e) {
      console.log(e);
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
