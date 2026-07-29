import ReviewSection from "../components/ReviewSection";
function ForgotPassword(){

  return(

    <div>

      <h1>
        Forgot Password
      </h1>

      <input
        type="email"
        placeholder="Enter Email"
      />

      <button>
        Send OTP
      </button>

      <ReviewSection targetType="forgot-password" />
    </div>
  );
}

export default ForgotPassword;