const checkConnexion = (request, response, next) => {
    if(request.session.user.connected_user === false){
        const messageCheckConnection = 'Vous devez être connecter pour accéder à cette page.';
        return response.status(401).json({message: messageCheckConnection, session: request.session.user});
    }
  
    if(request.session.user.connected_user === true) {
        next();
    }
  };
  
module.exports = checkConnexion;