export const getConnection = (req, res, next) => {
  res.send({
    message: "Connection successful",
    data: {},
  });
};
