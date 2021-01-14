import tw from "twin.macro";
import React, { useEffect, useState } from "react";
import { Link } from "./Link";

export interface Props {
  title: string;
}

interface IHeader {
  level: number;
  title: string;
  id: string;
  subHeaders: IHeader[];
}

const nodeNameToLevel = { H1: 1, H2: 2, H3: 3 };

const nodeToHeader = (node: HTMLHeadingElement): IHeader => ({
  level: nodeNameToLevel[node.nodeName],
  title: node.innerText,
  id: node.id,
  subHeaders: [],
});

const buildHeaderTreeRec = (
  nodes: HTMLHeadingElement[],
  elm: IHeader,
  level: number,
): IHeader[] => {
  const headers: IHeader[] = [];
  while (nodes.length > 0) {
    const h = nodeToHeader(nodes[0]);

    if (h.level === level) {
      headers.push(h);
      nodes.shift();
      elm = h;
    } else if (h.level > level) {
      elm.subHeaders = buildHeaderTreeRec(nodes, elm, h.level);
    } else {
      break;
    }
  }

  return headers;
};

const buildHeaderTree = (nodes: HTMLHeadingElement[]): IHeader[] => {
  if (nodes.length === 0) {
    return [];
  }

  const n = nodes[0];
  const h = nodeToHeader(n);

  return buildHeaderTreeRec(nodes, h, h.level);
};

// const buildHeaderTree = (nodes: HTMLHeadingElement[], atLevel?: number) => {
//   const headers: IHeader[] = [];

//   console.log(nodes);

// let curr: IHeader | null = null
//   for (const node of nodes) {
//     const h = nodeToHeader(node);
//     console.log("VISITING", h);

//     if (curr == null || h.level === curr.level) {
//       atLevel = h.level;

//       headers.push(h);
//       curr = h
//     } else if (h.level > curr.level) {

//     }
//   }

//   console.log(headers);
// };

// const getHeaders = (): IHeader[] => {

//   const headers: IHeader[] = [];
//   let currentHeader: IHeader | null = null;

//   for (const h of documentHeaders) {
//     const currHeaderLevel = levelRank(currentHeader?.level);
//     const headerRank = levelRank(h.nodeName);

// if (currentHeader == null) {
//   currentHeader = {
//     title: (h as any).innerText,
//     id: h.id,
//     subHeaders: [],
//     level: h.nodeName,
//   };

//   headers.push(currentHeader);
// } else if (headerRank > currHeaderLevel) {
//   // make this header a subheader of current one
// }
//   }

//   return headers;
// };

export const PageNav: React.FC<Props> = ({ title }) => {
  const [headers, setHeaders] = useState<IHeader[]>([]);

  useEffect(() => {
    const documentHeaders = Array.from(
      document.querySelectorAll(".docs-content h1, h2, h3"),
    ) as HTMLHeadingElement[];

    setHeaders(buildHeaderTree(documentHeaders));
  }, [title]);

  if (headers.length === 0) {
    return null;
  }

  return (
    <div tw="flex-col pt-8 px-8 pb-6 min-w-pageNav hidden lg:flex">
      <aside tw="sticky top-24">
        <h5 tw="text-sm text-gray-900 font-medium mb-3">On This Page</h5>
        <ul tw="space-y-3">
          <HeaderList headers={headers} nesting={0} />
        </ul>
      </aside>
    </div>
  );
};

const nestingTw = {
  0: tw`ml-0`,
  1: tw`ml-6`,
  2: tw`ml-10`,
};

const HeaderList: React.FC<{ headers: IHeader[]; nesting: number }> = ({
  headers,
  nesting,
}) => (
  <>
    {headers.map((h, i) => (
      <React.Fragment key={`${h.id}-${i}`}>
        <li key={h.id} css={[nestingTw[nesting]]}>
          <Link
            css={[tw`inline-block text-gray-600 text-sm`, tw`hover:underline`]}
            href={`#${h.id}`}
          >
            {h.title}
          </Link>
        </li>

        {h.subHeaders.length > 0 && (
          <HeaderList headers={h.subHeaders} nesting={nesting + 1} />
        )}
      </React.Fragment>
    ))}
  </>
);
