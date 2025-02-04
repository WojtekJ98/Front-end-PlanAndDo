import Header from "../../components/Header";
import AsideBar from "../../components/AsideBar";
import BoardView from "../../components/BoardView";
import { useState } from "react";

export default function Dashboard() {
  const [isAsideHidden, setIsAsideHidden] = useState(false);

  return (
    <>
      <div className="w-full  overflow-hidden flex flex-col ">
        <Header />
        <main className="w-full h-full flex ">
          <AsideBar isHidden={isAsideHidden} setIsHidden={setIsAsideHidden} />
          <BoardView isAsideHidden={isAsideHidden} />
        </main>
      </div>
    </>
  );
}
