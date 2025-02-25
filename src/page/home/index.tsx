import { Link } from "react-router-dom";
import { FcTodoList } from "react-icons/fc";

export default function Home() {
  // const navLink = [
  //   { title: "Description", link: "description" },
  //   { title: "Tech Stack", link: "tech-stack" },
  //   { title: "Contact", link: "contact" },
  // ];

  return (
    <>
      <div className="relative min-h-screen">
        <div className="bg -z-10"></div>
        <header className="w-full  border-b-1 border-gray-500 px-4 lg:px-20 py-4 text-white flex justify-between items-center  text-2xl ">
          <Link to="/" className="flex items-center gap-2 text-seccondColor">
            <FcTodoList className="text-4xl" />
            <h2 className="font-bold">Plan & Do</h2>
          </Link>
          {/* <nav className="hidden items-center gap-8 mr-20 md:flex">
            {navLink.map((e) => {
              return (
                <a
                  className="hover:text-seccondColor duration-200 px-2"
                  href={e.link}
                  key={e.title}>
                  {e.title}
                </a>
              );
            })}
          </nav> */}
        </header>
        <main className="w-full h-full flex items-center justify-center pt-20 lg:pt-40 lg:px-20 px-4 flex-col ">
          <h1 className="md:text-6xl text-4xl  font-bold text-white lg:w-3/5 text-center leading-tight ">
            Welcome in a ToDo App, which will help you manage your projects.
          </h1>
          <div className="py-8 text-white text-lg text-wrap lg:w-1/2 text-center">
            <p>
              The application will allow you to manage tasks, add new priority
              tasks and track deadlines.
            </p>
          </div>
          <Link
            to="/login"
            className="font-semibold px-4 py-2 rounded-lg bg-thirdColor hover:bg-seccondColor duration-200 hover:text-white">
            Get Started
          </Link>
        </main>
      </div>
    </>
  );
}
