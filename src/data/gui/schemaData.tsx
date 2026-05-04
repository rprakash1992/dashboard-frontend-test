// const schemaA: any = {
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//       minLength: 1,
//     },
//     description: {
//       type: "string",
//     },
//     done: {
//       type: "boolean",
//     },
//     due_date: {
//       type: "string",
//       format: "date",
//     },
//     rating: {
//       type: "integer",
//       maximum: 5,
//     },
//     recurrence: {
//       type: "string",
//       enum: ["Never", "Daily", "Weekly", "Monthly"],
//     },
//     recurrence_interval: {
//       type: "integer",
//     },
//   },
//   required: ["name", "due_date"],
// };

// const schemaB: any = {
//   type: "object",
//   properties: {
//     // name: {
//     //   type: "string",
//     //   minLength: 1,
//     // },
//     description: {
//       type: "string",
//     },
//     done: {
//       type: "boolean",
//     },
//     due_date: {
//       type: "string",
//       format: "date",
//     },
//     rating: {
//       type: "integer",
//       maximum: 5,
//     },
//     recurrence: {
//       type: "string",
//       enum: ["Never", "Daily", "Weekly", "Monthly"],
//     },
//     recurrence_interval: {
//       type: "integer",
//     },
//   },
//   required: ["name", "due_date"],
// };

// const uiSchemaA: any = {
//   type: "VerticalLayout",
//   elements: [
//     {
//       type: "Control",
//       label: false,
//       scope: "#/properties/done",
//     },
//     {
//       type: "Control",
//       scope: "#/properties/name",
//     },
//     {
//       type: "HorizontalLayout",
//       elements: [
//         {
//           type: "Control",
//           scope: "#/properties/due_date",
//         },
//         {
//           type: "Control",
//           scope: "#/properties/rating",
//         },
//       ],
//     },
//     {
//       type: "Control",
//       scope: "#/properties/description",
//       options: {
//         multi: true,
//       },
//     },
//     {
//       type: "HorizontalLayout",
//       elements: [
//         {
//           type: "Control",
//           scope: "#/properties/recurrence",
//         },
//         {
//           type: "Control",
//           scope: "#/properties/recurrence_interval",
//           rule: {
//             effect: "HIDE",
//             condition: {
//               scope: "#/properties/recurrence",
//               schema: {
//                 const: "Never",
//               },
//             },
//           },
//         },
//       ],
//     },
//   ],
// };

// const uiSchemaB: any = {
//   type: "VerticalLayout",
//   elements: [
//     {
//       type: "Control",
//       label: false,
//       scope: "#/properties/done",
//     },
//     // {
//     //   type: "Control",
//     //   scope: "#/properties/name",
//     // },
//     {
//       type: "HorizontalLayout",
//       elements: [
//         {
//           type: "Control",
//           scope: "#/properties/due_date",
//         },
//         {
//           type: "Control",
//           scope: "#/properties/rating",
//         },
//       ],
//     },
//     {
//       type: "Control",
//       scope: "#/properties/description",
//       options: {
//         multi: true,
//       },
//     },
//     {
//       type: "HorizontalLayout",
//       elements: [
//         {
//           type: "Control",
//           scope: "#/properties/recurrence",
//         },
//         {
//           type: "Control",
//           scope: "#/properties/recurrence_interval",
//           rule: {
//             effect: "HIDE",
//             condition: {
//               scope: "#/properties/recurrence",
//               schema: {
//                 const: "Never",
//               },
//             },
//           },
//         },
//       ],
//     },
//   ],
// };

const testSchemaA: any = {
  type: "object",
  properties: {
    fieldA: {
      type: "string",
    },
    fieldB: {
      type: "string",
    },
  },
};

const testSchemaB: any = {
  type: "object",
  properties: {
    fieldA: {
      type: "string",
    },
    fieldC: {
      type: "string",
    },
    fieldD: {
      type: "string",
    },
  },
};

const testUiSchemaA = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/fieldA",
    },
    {
      type: "Control",
      scope: "#/properties/fieldB",
    },
  ],
};

const testUiSchemaB = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/fieldA",
    },
    {
      type: "Control",
      scope: "#/properties/fieldC",
    },
    {
      type: "Control",
      scope: "#/properties/fieldD",
    },
  ],
};

export type FieldEnumsType = {
  fieldA: string;
  fieldB: string;
  fieldC: string;
  fieldD: string;
};

export const initialData = {
  fieldA: "",
  fieldB: "",
  fieldC: "",
  fieldD: "",
};

export const fieldEnums: FieldEnumsType = {
  fieldA: "Field A",
  fieldB: "Field B",
  fieldC: "Field C",
  fieldD: "Field D",
};

export const schemas: any = { schemaA: testSchemaA, schemaB: testSchemaB };

export const uiSchemas: any = {
  schemaA: testUiSchemaA,
  schemaB: testUiSchemaB,
};
