import DavidButton from "./components/buttons/david-button/david-button";
import HankButton from "./components/buttons/hank-button/hank-button";
import CollinButton from "./components/buttons/collin-button/collin-button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <DavidButton />
        <HankButton />
        <CollinButton />
      </main>
    </div>
  );
}
