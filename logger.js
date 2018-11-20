function log(req,res,next) {
    console.log('first middle ware function');
    next();
    }

 function log2(req,res,next) {
    console.log('first middle ware function');
    next();
    }
   
   module.exports = log;