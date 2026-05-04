import {
  rankWith,
  // scopeEndsWith,
  formatIs,
  and,
  schemaMatches,
  // hasType,
  // schemaTypeIs,
  // isObjectArrayWithNesting,
  // RankedTester,
  isObjectArray,
} from "@jsonforms/core";

export const InputBoxTester = rankWith(3, formatIs("inputbox"));

export const CheckBoxTester = rankWith(
  3,
  schemaMatches((schema) => schema.type === "boolean")
);

export const TextAreaBoxTester = rankWith(3, formatIs("textareabox"));

export const RadioGroupTester = rankWith(3, formatIs("radiogroup"));

export const ArrayLayoutTester = rankWith(
  5,
  isObjectArray
  // isObjectArrayWithNesting
);

export const SearchOrDropTester = rankWith(
  3,
  and(
    formatIs("searchOrDrop"),
    schemaMatches((schema) => schema.hasOwnProperty("sourceType"))
  )
);
