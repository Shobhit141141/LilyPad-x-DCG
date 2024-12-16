const getAppData = (_req, res) => {
  res.status(200).json({ message: "App data retrieved successfully" });
};

module.exports = {
  getAppData,
};
