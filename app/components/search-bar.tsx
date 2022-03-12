import { Form } from "remix";

export function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <div className="w-full px-6">
      <Form className="flex justify-center" method="get" action="/search">
        <div className="flex bg-dark-gray w-full max-w-[51rem] rounded-md">
          <span className="pl-3 flex justify-center items-center text-red-600">
            <SearchIconButton />
          </span>
          <input
            className="w-full p-4 rounded-md text-gray-200 focus:outline-none bg-dark-gray appearance-none"
            type="search"
            name="q"
            placeholder={placeholder ?? "Search bricks"}
            aria-label="Search bricks"
            autoComplete="off"
          ></input>
        </div>
      </Form>
    </div>
  );
}

function SearchIconButton() {
  return (
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}
