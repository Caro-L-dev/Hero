const userMiddleware = (req, res, next) => {
    // Si il n'y a pas de session user 
    if(!req.session.user) {
      // On la crée et on dit que par default le connected user est false
        req.session.user = {connected_user: false};
    };
    // puis on laisse le programme continuer son chemin
    next();
  };
  
  
module.exports = userMiddleware;