import { fetchR1 } from "../models/GST-R1.js";

export const getR1Filers = async (req, res, next) => {
  console.log("FETCH R1");
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
  const A5_B5 = createTable("5A_5B", "B2C (Large) Invoices");
  const B6 = createTable("6B", "Supplies made to SEZ unit or SEZ developer");
  const C6 = createTable("6C", "Deemed Exports");

  const B9_1 = createTable("9B_1", "Credit/Debit Notes (Registered)");
  const B9_2 = createTable("9B_2", "Credit/Debit Notes (Unregistered)");
  const A6 = createTable("6A", "Exports (with/without payment)");
  const A9_1 = createTable(
    "9A_1",
    "Amendment to taxable outward supplies - B2B Regular"
  );
  const A9_2 = createTable(
    "9A_2",
    "Amendment to taxable outward supplies - B2B Reverse charge"
  );
  const A9_3 = createTable(
    "9A_3",
    "Amendment to Inter-State supplies B2CL (Large)"
  );
  const A9_4 = createTable("9A_4", "Amendment to Export supplies");
  const A9_5 = createTable("9A_5", "Amendment to supplies made to SEZ");
  const A9_6 = createTable("9A_6", "Amendment to Deemed Exports");
  const C9_1 = createTable("9C_1", "Amended Credit/Debit Notes (Registered)");
  const C9_2 = createTable("9C_2", "Amended Credit/Debit Notes (Unregistered)");

  B9_2.B2CL = createTable("B2CL", "B2CL");
  B9_2.EXPWP = createTable("EXPWP", "EXPWP");
  B9_2.EXPWOP = createTable("EXPWOP", "EXPWOP");

  const tables = [
    A4,
    B4,
    C4,
    A5_B5,
    B6,
    C6,
    B9_1,
    B9_2,
    A6,
    A9_1,
    A9_2,
    A9_3,
    A9_4,
    A9_5,
    A9_6,
    C9_1,
    C9_2,
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

        if (data.b2cl) {
          const parsedData = JSON.parse(data.b2cl);

          if (parsedData) {
            for (let sub of parsedData) {
              for (let inv of sub["inv"]) {
                for (let item of inv["itms"]) {
                  if (item) {
                    feedData(A5_B5, item);
                  }
                }
              }
            }
          }
        }

        // Credit/Debit Notes (Registered)
        if (data.CreditandDebitNote) {
          const parsedData = JSON.parse(data.CreditandDebitNote);
          if (parsedData && parsedData.length) {
            for (let data of parsedData) {
              const notes = data["nt"]; // array of notes
              for (let note of notes) {
                feedData(B9_1, note.itms[0]);
              }
            }
          }
        }

        // Credit/Debit Notes (Unregistered)
        if (data.CreditAndDebitNoteForUnregistered) {
          const parsedData = JSON.parse(data.CreditAndDebitNoteForUnregistered);
          if (parsedData && parsedData.length) {
            for (let note of parsedData) {
              if (note.typ == "B2CL") {
                feedData(B9_2.B2CL, note.itms[0]);
              } else if (note.typ == "EXPWP") {
                feedData(B9_2.EXPWP, note.itms[0]);
              } else if (note.typ == "EXPWOP") {
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
                      inv["inv_typ"] == "SEWP" ||
                      inv["inv_typ"] == "SEWOP"
                    ) {
                      // Supplies made to SEZ unit or SEZ developer
                      feedData(A9_5, item);
                    } else if (inv["inv_typ"] == "DE") {
                      // Deemed Exports
                      feedData(A9_6, item);
                    } else if (inv["inv_typ"] == "CBW") {
                      // Custom Bonded Warehouse
                      // ⚠️TODO - CBW mentioned attributes in excel sheet but not present in GSTR1 form⚠️
                      // feedData(?, item);
                    }
                    // ⚠️TODO - A9_3, A9_4⚠️
                  }
                }
              }
            }
          }
        }

        // Exports with or without payment
        if (data.Exports) {
          const parsedData = JSON.parse(data.Exports);
          if (parsedData && parsedData.length) {
            for (let data of parsedData) {
              const invoices = data["inv"]; // array of invoices
              for (let invoice of invoices) {
                const item = invoice.itms[0];
                A6.numberOfRecords++;
                A6.csamt += Number.parseFloat(item["csamt"] || "0.00");
                A6.txval += Number.parseFloat(item["txval"] || "0.00");
                A6.iamt += Number.parseFloat(item["iamt"] || "0.00");
                A6.camt += Number.parseFloat(item["camt"] || "0.00");
                A6.samt += Number.parseFloat(item["samt"] || "0.00");
              }
            }
          }
        }

        // ⚠️TODO - C9_1, C9_2⚠️
      }

      result.numberOfFilingsMadeByGSTIN = numberOfFilingsMadeByGSTIN;
      for (let table of tables) {
        result["table" + table.name] = table;
      }

      const createTable = (name, desc) => {
        return new Object({
          name: name,
          csamt: 0,
          rt: 0,
          txval: 0,
          iamt: 0,
          camt: 0,
          samt: 0,
          desc: desc || "",
        });
      };
      const A11 = (name, desc) => {
        return new Object({
          name: name,
          samt: 0.0,
          rt: 0.0,
          iamt: 0.0,
          ad_amt: 0.0,
          camt: 0.0,
          csamt: 0.0,
          desc: desc || "",
        });
      };
      const A7 = createTable("7", "Taxable supplies to ungistered persons");
      const A8 = {
        name: "8",
        expt_amt: 0.0,
        nil_amt: 0.0,
        ngsup_amt: 0.0,
        desc: "Nil rated, exempted and non GST outward supplies",
      };
      const A11A = A11(
        "11A(1,2)",
        "Advances received for which invoice has not been issued"
      );
      const A11B = A11(
        "11B(1,2)",
        "Advance Amount received in earlier tax period and adjusted against the supplies"
      );
      const A12 = {
        name: "12",
        csamt: 0.0,
        val: 0.0,
        iamt: 0.0,
        samt: 0.0,
        txval: 0.0,
        camt: 0.0,
        desc: "HSN wise summary of outward supplies",
      };
      for (let data of datas) {
        if (data) {
          if (data.Id) data.Id = data.Id.toString();
          if (data.FileId) data.FileId = data.FileId.toString();
        }
        // B2CS is a 7 table
        if (data.b2cs) {
          const parsedData = JSON.parse(data.b2cs);
          if (parsedData) {
            for (let item of parsedData) {
              if (item) {
                A7.csamt += Number.parseFloat(item.csamt || "0.00");
                A7.rt += Number.parseFloat(item.rt || "0.00");
                A7.txval += Number.parseFloat(item.txval || "0.00");
                A7.iamt += Number.parseFloat(item.iamt || "0.00");
                A7.camt += Number.parseFloat(item.camt || "0.00");
                A7.samt += Number.parseFloat(item.samt || "0.00");
              }
            }
          }
        }

        // nil = table 8
        if (data.nil) {
          const nilvalue = JSON.parse(data.nil).inv;
          if (nilvalue) {
            for (const demo of nilvalue) {
              A8.expt_amt += Number.parseFloat(demo.expt_amt || "0.00");
              A8.nil_amt += Number.parseFloat(demo.nil_amt || "0.00");
              A8.ngsup_amt += Number.parseFloat(demo.ngsup_amt || "0.00");
            }
          }
        }

        // 11(a)_1 , 11(a)_2 ,
        if (data.AdvanceTax) {
          const A11th = JSON.parse(data.AdvanceTax);
          if (A11th) {
            for (let dataest of A11th) {
              for (let Dataest of dataest.itms) {
                A11A.ad_amt += Number.parseFloat(Dataest.ad_amt || "0.00");
                A11A.camt += Number.parseFloat(Dataest.camt || "0.00");
                A11A.samt += Number.parseFloat(Dataest.samt || "0.00");
                A11A.rt += Number.parseFloat(Dataest.rt || "0.00");
                A11A.iamt += Number.parseFloat(Dataest.iamt || "0.00");
                A11A.csamt += Number.parseFloat(Dataest.csamt || "0.00");
              }
            }
          }
        }
        //11(b)_1 , 11(b)_2
        if (data.AdvanceAdjustedDetail) {
          const A11thB = JSON.parse(data.AdvanceAdjustedDetail);
          if (A11thB) {
            for (let dataest of A11thB) {
              for (let Dataest of dataest.itms) {
                A11B.ad_amt += Number.parseFloat(Dataest.ad_amt || "0.00");
                A11B.camt += Number.parseFloat(Dataest.camt || "0.00");
                A11B.samt += Number.parseFloat(Dataest.samt || "0.00");
                A11B.rt += Number.parseFloat(Dataest.rt || "0.00");
                A11B.iamt += Number.parseFloat(Dataest.iamt || "0.00");
                A11B.csamt += Number.parseFloat(Dataest.csamt || "0.00");
              }
            }
          }
        }
        //table 12
        if (data.hsn) {
          const A12th = JSON.parse(data.hsn);
          if (A12th?.data) {
            for (let dataes of A12th.data) {
              A12.camt += Number.parseFloat(dataes.camt || "0.00");
              A12.csamt += Number.parseFloat(dataes.csamt || "0.00");
              A12.val += Number.parseFloat(dataes.val || "0.00");
              A12.iamt += Number.parseFloat(dataes.iamt || "0.00");
              A12.samt += Number.parseFloat(dataes.samt || "0.00");
              A12.txval += Number.parseFloat(dataes.txval || "0.00");
            }
          }
        }

        // table 13 is null everywhere
      }
      result["table7"] = A7;
      result["table8"] = A8;
      result["table11A_1"] = A11A;
      result["table11B_2"] = A11B;
      result["table12"] = A12;

      console.log("R1 SENT");

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
