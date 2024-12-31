export const errorHandler= (statsCode,message)=>{
    const error = new Error();
    error.statsCode=statsCode;
    error.message=message;
    return error;
}