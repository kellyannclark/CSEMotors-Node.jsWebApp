const errorController = {};

errorController.generateError = (req, res, next) => {
  try {
    // Simulate an error by throwing an exception
    throw new Error("Intentional 500 Error");
  } catch (error) {
    // Build the error page HTML
    const errorPage = utilities.buildErrPage('500 Internal Server Error', error.message);

    // Render the error page
    res.status(500).render("errors/error", {
      title: "500 Internal Server Error",
      message: error.message,
    });
  }
};

module.exports = errorController;
