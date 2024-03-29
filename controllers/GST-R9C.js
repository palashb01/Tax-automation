import { fetchR9C } from "../models/GST-R9C.js";
import { fetchExistance } from "../models/GSTIN_EXISTS.js";
import log from "../utils/log.js";

export const getR9CFilers = async (req, res, next) => {
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const fetch_if_exists = await fetchExistance(GSTIN);
      if (!fetch_if_exists) {
        res.status(404).send({
          message: "No record found",
          data: null,
          error: null,
        });
        return;
      }else{
        if(!fetch_if_exists.R9C_FILERS){
          res.status(200).send({
            message: "No content present for the provided GSTIN",
            data: null,
            error: null,
          });
          return;
        }
      }
      const data = await fetchR9C(GSTIN);
      if (data && data.GSTIN.toLowerCase() == GSTIN.toLowerCase()) {
        const datas = JSON.parse(data.gstr9cdata);
        const finaldata = datas.audited_data;
        const createtable = (name, desc) => {
          return new Object({
            name: name,
            desc: desc,
          })
        }
        const row5r = createtable("5r", "Un-reconciled turnover");
        const row7g = createtable("7g", "Un-reconciled taxable turnover");
        const row9r = createtable("9r", "Un-reconciled payment of amount");
        const row12f = createtable("12f", "Un-reconciled ITC");
        const row12c = createtable("12c", "ITC booked in current financial year to be claimed in subsequent financial years");
        const row5p = createtable("5p", "Annual turnover after adjustments");
        const row9p = createtable("9p", "Total amount to be paid");

        if (finaldata.table5) {
          row5r.unrec_turnovr = finaldata.table5.unrec_turnovr;
          row5p.annul_turn_adj = finaldata.table5.annul_turn_adj;
        }
        if (finaldata.table7) {
          row7g.unrec_tax_turn = finaldata.table7.unrec_tax_turn;
        }
        if (finaldata.table9) {
          row9r.camt = finaldata.table9.unrec_amt.cgst;
          row9r.samt = finaldata.table9.unrec_amt.sgst;
          row9r.iamt = finaldata.table9.unrec_amt.igst;
          row9r.csamt = finaldata.table9.unrec_amt.cess;
          row9p.camt = finaldata.table9.tot_amt_payable.cgst;
          row9p.samt = finaldata.table9.tot_amt_payable.sgst;
          row9p.iamt = finaldata.table9.tot_amt_payable.igst;
          row9p.csamt = finaldata.table9.tot_amt_payable.cess;
        }
        if (finaldata.table12) {
          row12f.unrec_itc = finaldata.table12.unrec_itc;
          row12c.itc_book_curr = finaldata.table12.itc_book_curr;
        }
        const result = {};

        result.row7g = row7g;
        result.row5r = row5r;
        result.row9r = row9r;
        result.row12f = row12f;
        result.row9p = row9p;
        result.row12c = row12c;
        result.row5p = row5p;

        res.status(200).send({
          message: "Fetch successful",
          data: result,
          error: null,
        });
      } else {
        res.status(200).send({
          message: "No content present for the provided GSTIN",
          data: null,
          error: null,
        });
      }
    } catch (e) {
      log(e);
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
