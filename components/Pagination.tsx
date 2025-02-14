"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();

  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;

    if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else if (type === "next") {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 0) {
      router.push(`${path}?page-number=${nextPageNumber}`);
    } else {
      router.push(`${path}`);
    }
  };

  if (!isNext && Number(pageNumber) === 1) return null;

  return (
    <div className="mt-10 flex w-full items-center justify-center gap-5">
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className="bg-black text-white"
      >
        Prev
      </Button>
      <p className="text-small-semibold text-light-1">{pageNumber}</p>
      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className="bg-black text-white"
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
