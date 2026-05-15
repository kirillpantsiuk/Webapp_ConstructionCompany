const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Відмовлено в доступі: ваша роль (${req.user?.role}) не має прав на цю дію` 
      });
    }
    next();
  };
};

module.exports = { authorize };