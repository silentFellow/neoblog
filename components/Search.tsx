"use client";

import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  return (
    <>
      <Input
        autoFocus
        type="search"
        placeholder="Search for..."
        className="no-focus roounded-md w-[30rem]"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key.toLowerCase() === "enter")
            router.push(`/?search=${search}`);
        }}
      />

      <Button onClick={() => router.push(`/?search=${search}`)}>
        <FaSearch />
        Search
      </Button>
    </>
  );
};

export default Search;
