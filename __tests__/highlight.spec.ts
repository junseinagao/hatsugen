import { expect, describe, it, vi } from "vitest";
import {
  getUniqueSentenceList,
  enHighlight,
  DEFAULT_MATCHER,
  DEFAULT_REPLACER,
  getUniqueNameList,
  getSetenceWithNameIdList,
  getXPath,
} from "../src/highlight";

describe("getUniqueSentenceList", () => {
  it("surround a target text in Element with span tag.", () => {
    const target = document.createElement("div");
    target.textContent = "hoge and fuga";
    enHighlight(target, "fuga", 1);
    const span = target.querySelector("span");
    expect(span?.textContent).toBe("fuga");
    expect(span?.dataset["hatsugen-id"]).toBe("1");
  });
});

describe("getUniqueSentenceList", () => {
  it("return an array of unique sentences with DEFAULT_MATCHER", () => {
    const result = getUniqueSentenceList(
      "A) hogehoge\nB) fugafuga\nSHOULD NO MATCH",
      DEFAULT_MATCHER
    );
    expect(result).toEqual(["A) hogehoge", "B) fugafuga"]);
  });
});

describe("getUniqueNameList", () => {
  it("return an array of unique name that each of sentence have", () => {
    const result = getUniqueNameList(
      ["A) hogehoge", "B) fugafuga"],
      DEFAULT_REPLACER
    );
    expect(result).toEqual(["A", "B"]);
  });
});

describe("getSetenceWithNameIdList", () => {
  it("return an array of object that have sentence and unique nameId", () => {
    const result = getSetenceWithNameIdList(
      ["A) hogehoge", "B) fugafuga"],
      ["A", "B"],
      DEFAULT_REPLACER
    );
    expect(result).toEqual([
      {
        sentence: "A) hogehoge",
        nameId: 1,
      },
      {
        sentence: "B) fugafuga",
        nameId: 2,
      },
    ]);
  });
});

describe("enHighlight", () => {
  it("throw error if it don't get Element", () => {
    expect(() => enHighlight(null, "hoge", 0)).toThrow();
  });

  it("wrap sentence with span tag with data-hatsugen-id attribute", () => {
    const div = document.createElement("div");
    div.textContent = "A) hogehoge\nB) fugfuga";
    enHighlight(div, "B) fugfuga", "test-id");
    expect(div.innerHTML).toEqual(
      'A) hogehoge\n<span data-hatsugen-id="test-id">B) fugfuga</span>'
    );
  });
});

describe("getXPath", () => {
  it("called document.evaluate", () => {
    document.evaluate = vi.fn();
    vi.stubGlobal("XPathResult", {
      UNORDERED_NODE_SNAPSHOT_TYPE: 0,
    });
    getXPath("");
    expect(document.evaluate).toBeCalled();
  });
});
