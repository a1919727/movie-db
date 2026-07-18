import { movieInfor } from "@/data/mock-data";
import type { MovieInformation } from "@/types/movie";

type MovieInforProps = {
  movieInformation?: MovieInformation;
};

export function MovieDetailInfor({
  movieInformation = movieInfor[0],
}: MovieInforProps) {
  const currentActors = movieInformation.actors;
  const leftColumn = [
    { label: "Country", value: movieInformation.country },
    { label: "Language", value: movieInformation.language },
    { label: "Runtime", value: movieInformation.runtime },
  ];

  const rightColumn = [
    { label: "Release Date", value: movieInformation.releaseDate },
    { label: "Director", value: movieInformation.director },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="max-w-6xl">
        <h1 className="mb-5 text-3xl font-semibold">Infomation</h1>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-6">
            {leftColumn.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-6 border-t border-neutral-500/60 pt-4"
              >
                <span className="text-base font-semibold text-zinc-100">
                  {item.label}
                </span>
                <span className="text-right font-normal text-neutral-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {rightColumn.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-6 border-t border-neutral-500/60 pt-4"
              >
                <span className="text-base font-semibold text-zinc-100">
                  {item.label}
                </span>
                <span className="text-right font-normal text-neutral-300">
                  {item.value}
                </span>
              </div>
            ))}
            <div className="flex items-start justify-between gap-6 border-t border-neutral-500/60 pt-4">
              <span className="text-base font-semibold text-zinc-100">
                Actors
              </span>
              <div className="flex flex-col gap-1 text-right font-normal text-neutral-300">
                {currentActors.map((actor) => (
                  <span key={actor}>{actor}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
