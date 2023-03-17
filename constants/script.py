import json
with open("./constants/input.js") as f:
    data = f.read()
    parsed = json.loads(data)
    print(len(parsed))
    emp_dict = {}
    for emp in parsed:
        emp_dict[emp["Scode"]] = emp

open("./constants/out.json", "w+").write(str(emp_dict).replace('\'', "\""))


