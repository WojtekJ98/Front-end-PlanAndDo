import Header from "../../components/Header";
import AsideBar from "../../components/AsideBar";
import BoardView from "../../components/BoardView";

export default function Dashboard() {
  return (
    <>
      <div className="w-full  h-screen max-h-screen overflow-hidden ">
        <Header />
        <main className="w-full h-full ">
          <div className="h-full w-full grid grid-cols-[1fr_4fr]  ">
            <AsideBar />
            <BoardView />
          </div>
        </main>
      </div>
    </>
  );
}
