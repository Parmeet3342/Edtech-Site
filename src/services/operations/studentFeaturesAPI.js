import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_API
} = studentEndpoints

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src

        script.onload = () => {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script);
    })
}

export async function buyCourse(token,courses,userDetails,navigate,dispatch) {
    const toastId = toast.loading("Loading...")
    try{
        
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toast.error("Razorpay SDK failed to load")
            return;
        }

        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            {
              courses,
            },
            {
              Authorization: `Bearer ${token}`,
            }
        )

        console.log("hi...",orderResponse)
        // if(!orderResponse.data.success){
        //     throw new Error(orderResponse.data.message)
        // }

        console.log(process.env.REACT_APP_RAZORPAY_KEY)
        const options = {
            key:process.env.REACT_APP_RAZORPAY_KEY,
            currency:orderResponse.data.data.currency,
            amount:`${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.id,
            name:"StudyNotion",
            description:"Thank You for purchasing the course",
            image:rzpLogo,
            prefill:{
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email
            },
            handler: function(response){
                sendPaymentSucessEmail(response,orderResponse.data.data.amount,token);
                verifyPayment({...response,courses},token,navigate,dispatch);
            }
        }

        console.log("Hello Parmeet1",options)
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed")
            console.log(response.error)
        })
    }
    catch(error){
        console.log("PAYMENT API ERROR...",error)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSucessEmail(response,amount,token){
    try{

        await apiConnector("POST",SEND_PAYMENT_SUCCESS_API,{
            orderId:response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },
    {
        Authorization: `Bearer ${token}`
    })
    }
    catch(error){
        console.log("PAYMENT SUCCESS EMAIL ERROR.....",error)
    }
}

async function verifyPayment(bodyData,token,navigate, dispatch){
    const toastId = toast.loading("Verifying Payment")
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,
            {
                Authorization: `Bearer ${token}`
            }
        )

        console.log("Hello parmeet4");
        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Payment successfull you are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart());
    }
    catch(error){
        console.log("PAYMENT VERIFY ERROR...",error)
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId)
    dispatch(setPaymentLoading(false))
}