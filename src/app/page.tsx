import Link from "next/link";


export default function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>Click para ir a página Home</h1>

      <Link href={"/home"}>
        <button 
          className={`
            bg-cyan-500
            p-3
            rounded-md
            hover:bg-cyan-600
            font-bold
          `}
        >
          Home
        </button>
      </Link>

    </main>
  )
}
