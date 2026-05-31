import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
  "P1",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col">
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
         </div>
      </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
      </div>
    </>
  );
};
