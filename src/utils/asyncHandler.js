

// ********** USING PROMISES ************

const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch(err => next(err))
    }
}

export {asyncHandler}


// const asyncHandler = (func) => {}   // Passing function is higher order func
// const asyncHandler = (func) => {() => {}} // Further passing the func
// const asyncHandler = (func) => () => {} // removing curly braces for clean syntax



// ************ USING TRYCATCH **********


// const asyncHandler = (func) => async (req,res,next) => {
//     try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({   // Send status code and json file on error
//             success: false,
//             message: err.message
//         })
//     }
// }