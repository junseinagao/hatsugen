export const DEFAULT_MATCHER = /^[^(\n]*\)\s.*/gm;
export const DEFAULT_REPLACER = ")";

export const getUniqueSentenceList = (text: string, matcher: RegExp) => [
  ...new Set([...text.matchAll(matcher)].map(([sentence]) => sentence)),
];

export const getUniqueNameList = (sentences: string[], replacer: string) => [
  ...new Set(
    sentences.map((sentence) => sentence.split(replacer)).map(([name]) => name)
  ),
];

export const getSetenceWithNameIdList = (
  sentences: string[],
  names: string[],
  replacer: string
) =>
  sentences.map((sentence) => ({
    sentence,
    nameId: names.indexOf(sentence.split(replacer)[0]) + 1,
  }));

export const enHighlight = (
  node: Node | null,
  sentence: string,
  id: number | string
) => {
  if (node instanceof Element) {
    node.innerHTML = node.innerHTML.replace(
      sentence,
      `<span data-hatsugen-id="${id}">${sentence}</span>`
    );
  } else throw new Error("node is not an instance of Element");
};

export const getXPath = (sentence: string) =>
  document.evaluate(
    `//*[contains(text(),"${sentence}") or text()[contains(.,"${sentence}")]]`,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

export const HTMLHighlighter = (
  matcher = DEFAULT_MATCHER,
  replacer = DEFAULT_REPLACER
) => {
  const uniqueSentenceList = getUniqueSentenceList(
    document.body.innerText,
    matcher
  );
  const uniqueNameList = getUniqueNameList(uniqueSentenceList, replacer);
  const sentenceWithNameIdList = getSetenceWithNameIdList(
    uniqueSentenceList,
    uniqueNameList,
    replacer
  );
  sentenceWithNameIdList.forEach(({ sentence, nameId }) => {
    const xpath = getXPath(sentence);
    for (let i = 0; i < xpath.snapshotLength; i++) {
      enHighlight(xpath.snapshotItem(i), sentence, nameId);
    }
  });
};
