import json

f = open("./constants/input.js")
data = f.read()
parsed = json.loads(data)
print(len(parsed))

emp_dict = {}
for emp in parsed:
    key = emp["gst_Scode"]
    value = {
        "EmpID": emp["EmpID"],
        "name": emp["name"],
        "vat_OfficeCode": emp["vat_OfficeCode"],
        "DESIG": emp["DESIG"],
        "sector": emp["sector"]
    }
    emp_dict[key] = value

out = open("./constants/out.json", "w+")
out.write(str(emp_dict))
