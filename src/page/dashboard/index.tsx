import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function Dashboard() {
  const { logout } = useAuth();
  return (
    <>
      <div>
        <div className="bg -z-10"></div>
        <header className="w-full  border-b-1 border-gray-500 px-4 lg:px-20 py-4 text-white flex justify-between items-center  text-2xl ">
          <Link to="/">
            <h2>ToDo Logo</h2>
          </Link>
          <button onClick={logout}>Logout</button>
        </header>
        <h1 className="text-white">Welcome in ToDo APP</h1>
      </div>
    </>
  );
}
