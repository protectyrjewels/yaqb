import {
  CoreConfig,
  // TreeActions,
  TreeState,
  TreeStore,
  Utils,
} from "@react-awesome-query-builder/core";
import { IDialect, QueryBuilder, RuleGroup } from "@yaqb/core";
// import { formatQuery } from "react-querybuilder";
import { Condition, example_query_config } from "./config/query-config";

export class QueryResolver implements IDialect {
  config = {
    ...CoreConfig,
    // fields: {
    //   name: {
    //     label: "Name",
    //     type: "text",
    //   },
    //   age: {
    //     label: "Age",
    //     type: "number",
    //   },
    // },
  };

  // initialTree = Utils.loadTree({
  //   id: "00001",
  //   type: "group",
  //   children1: [
  //     {
  //       id: "00002",
  //       type: "rule",
  //       properties: {
  //         field: "age",
  //         operator: "greater_or_equal",
  //         value: [18],
  //         valueSrc: ["value"],
  //       },
  //     },
  //   ],
  // });

  initialTree = Utils.loadTree({
    id: "00001",
    type: "group",
    children1: [
      {
        id: "00002",
        type: "rule",
        properties: {
          field: "",
          operator: "",
          value: ["Did"],
          valueSrc: ["value"],
        },
      },
      {
        id: "00003",
        type: "rule",
        properties: {
          field: "",
          operator: "",
          value: ["Buy"],
          valueSrc: ["value"],
        },
      },
      {
        id: "00004",
        type: "rule",
        properties: {
          field: "amount",
          operator: "greater",
          value: [100],
          valueSrc: ["value"],
        },
      },
      {
        id: "00005",
        type: "rule",
        properties: {
          field: "",
          operator: "",
          value: ["dolar"],
          valueSrc: ["value"],
        },
      },
      {
        id: "00006",
        type: "rule",
        properties: {
          field: "months",
          operator: "less",
          value: [6],
          valueSrc: ["value"],
        },
      },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  fromQuery(query: any, options?: any) {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  toQuery(rules: RuleGroup, options?: any) {
    const reducer = TreeStore(this.config);
    const state: TreeState = reducer({ tree: this.initialTree });

    // const rootPath = [state.tree.get("id") as string];
    // const action = TreeActions.tree.addRule(this.config, rootPath, {
    //   field: "name",
    //   operator: "equal",
    //   value: ["denis"],
    //   valueSrc: ["value"],
    //   valueType: ["text"],
    // });
    // state = reducer(state, action);
    // const sql = Utils.mongodbFormat(state.tree, this.config);
    const sql = Utils.sqlFormat(state.tree, this.config);
    console.log("lopes", sql);
    return sql;
  }

  readonly id: string = "query-resolver";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _just_a_test(inputs: { [key: string]: any }) {
    const { where, mapper } = example_query_config.Geographic;

    const whereParts: Condition[] = [];

    where.forEach((condition) => {
      let field = condition.field;
      let operator = condition.operator;
      let value = condition.value;

      let allPlaceholdersReplaced = true;

      for (const key in inputs) {
        const placeholder = `\${${key}}`;

        if (field.includes(placeholder)) {
          field = field.replace(placeholder, inputs[key]);
        }
        if (operator.includes(placeholder)) {
          operator = mapper[key] ? mapper[key][inputs[key]] : inputs[key];
        }
        if (value.includes(placeholder)) {
          value = `${inputs[key]}`;
        }
      }

      if (
        field.includes("${") ||
        operator.includes("${") ||
        value.includes("${")
      ) {
        allPlaceholdersReplaced = false;
      }

      if (allPlaceholdersReplaced && field && operator && value) {
        whereParts.push({ field, operator, value });
      }
    });

    return whereParts;
  }
}

QueryBuilder.registerDialect(new QueryResolver());

export { QueryBuilder };
