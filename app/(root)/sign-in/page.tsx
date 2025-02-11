import UserForm from "@/components/forms/UserForm";

const Login = () => {
  return (
    <div className="h-[calc(100vh-2.25rem)] center">
      <div className="p-5 w-[390px] shadow-2xl">
        <UserForm type="login" />
      </div>
    </div>
  );
};

export default Login;
