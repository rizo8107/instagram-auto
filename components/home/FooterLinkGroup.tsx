import { FooterLinkGroupProps } from "@/types/types";
import React from "react";

type Props = {};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div className="flex overflow-hidden flex-col flex-1 shrink basis-0">
      <div className="text-base font-semibold text-white">{title}</div>
      <div className="flex flex-col mt-4 w-full text-sm text-white">
        {links.map((link, index) => (
          <div key={index} className="flex-1 shrink py-2 w-full">
            {link}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterLinkGroup;
