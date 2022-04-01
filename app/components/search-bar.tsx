import { Form } from "remix";

export function SearchBar({
  placeholder,
  defaultValue,
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="w-full px-6">
      <Form
        reloadDocument
        className="flex justify-center"
        method="get"
        action="/search"
      >
        <div className="flex w-full max-w-[51rem] rounded-md bg-dark-gray">
          <span className="flex items-center justify-center pl-3 text-red-600">
            <SearchIconButton />
          </span>
          <input
            className="text-gray-200 w-full appearance-none rounded-md bg-dark-gray p-4 focus:outline-none"
            type="search"
            name="q"
            placeholder={placeholder ?? "Search bricks"}
            defaultValue={defaultValue}
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
    <button aria-label="search">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <title>search</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}
