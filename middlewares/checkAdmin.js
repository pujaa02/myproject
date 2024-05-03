exports.checkAdmin = async (req,res,next)=>{
  if(req.user[0].role_id!=0){
    return res.status(403).send("<h1>Access Denied....<h1>");
  }
  else{
    next();
  }
}