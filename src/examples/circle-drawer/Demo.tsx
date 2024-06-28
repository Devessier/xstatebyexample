import { Color, Redo, Size, Undo } from "./components/Controls";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Stage from "./components/Stage";
import { CircleContext } from "./machine";
import type { ActorOptions, AnyActorLogic } from "xstate";
import "./styles/main.css";
// import "./styles/utils.css";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  return (
    <div id="circle-drawer-example">
      <CircleContext.Provider options={actorOptions}>
        <Header>
          <Undo />
          <Size />
          <Color />
          <Redo />
        </Header>
        <Stage />
        <Footer />
      </CircleContext.Provider>
    </div>
  );
}
