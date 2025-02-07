import UserForm from "@/components/forms/UserForm";

const Login = () => {
  return (
    <div className="h-full w-full center">
      <div className="p-5 w-[390px] shadow-2xl">
        <UserForm type="sign-up" />
      </div>
    </div>
  );
};

export default Login;
