import {
  CoreConfig,
  // TreeActions,
  TreeState,
  TreeStore,
  Utils,
} from "@react-awesome-query-builder/core";
import { IDialect, QueryBuilder, RuleGroup } from "@yaqb/core";
// import { formatQuery } from "react-querybuilder";
import {
  Condition,
  Config,
  example_query_config,
  JoinCondition,
  JoinConfig,
  TreeConfig,
} from "./config/query-config";

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
    const { where, mapper, joins } = example_query_config.Geographic;

    const whereParts: Condition[] = [];
    const joinParts: JoinConfig[] = [];

    // WHERE
    if (where) {
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
          if (mapper && operator.includes(placeholder)) {
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
    }

    // JOIN
    if (joins) {
      joins.forEach((join) => {
        const appendCondition = join.appendCondition;

        if (appendCondition) {
          let valueToCompare = appendCondition.valueToCompare;

          if (valueToCompare.includes("${")) {
            for (const key in inputs) {
              const placeholder = `\${${key}}`;
              if (valueToCompare.includes(placeholder)) {
                valueToCompare = valueToCompare.replace(
                  placeholder,
                  inputs[key]
                );
                break;
              }
            }
          }

          const fieldValue = inputs[appendCondition.fieldId];
          if (fieldValue !== valueToCompare) return;
        }

        let type = join.type;
        let sourceModel = join.sourceModel;
        let targetModel = join.targetModel;

        const validConditions: JoinCondition[] = [];
        join.conditions.forEach((cond) => {
          let sourceField = cond.sourceField;
          let targetField = cond.targetField;
          let operator = cond.operator;

          let allPlaceholdersReplaced = true;

          for (const key in inputs) {
            const placeholder = `\${${key}}`;

            if (sourceField.includes(placeholder)) {
              sourceField = sourceField.replace(placeholder, inputs[key]);
            }
            if (targetField.includes(placeholder)) {
              targetField = targetField.replace(placeholder, inputs[key]);
            }
            if (mapper && operator.includes(placeholder)) {
              operator = mapper[key] ? mapper[key][inputs[key]] : inputs[key];
            }
          }

          if (sourceField.includes("${") || targetField.includes("${")) {
            allPlaceholdersReplaced = false;
          }

          if (allPlaceholdersReplaced) {
            validConditions.push({ sourceField, targetField, operator });
          }
        });

        let allPlaceholdersReplacedInJoin = true;
        for (const key in inputs) {
          const placeholder = `\${${key}}`;

          if (type.includes(placeholder)) {
            type = type.replace(placeholder, inputs[key]);
          }
          if (sourceModel.includes(placeholder)) {
            sourceModel = sourceModel.replace(placeholder, inputs[key]);
          }
          if (targetModel.includes(placeholder)) {
            targetModel = targetModel.replace(placeholder, inputs[key]);
          }
        }

        if (
          type.includes("${") ||
          sourceModel.includes("${") ||
          targetModel.includes("${")
        ) {
          allPlaceholdersReplacedInJoin = false;
        }

        if (allPlaceholdersReplacedInJoin && validConditions.length > 0) {
          joinParts.push({
            type,
            sourceModel,
            targetModel,
            conditions: validConditions,
          });
        }
      });
    }

    return { whereParts, joinParts };
  }

  _config_replacement(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputs: { [key: string]: any },
    config: TreeConfig,
    config_id: string
  ): Config {
    const selected_config = config[config_id];

    if (!selected_config) throw new Error("T o D o");

    const { where, mapper, joins } = selected_config;

    const whereParts: Condition[] = [];
    const joinParts: JoinConfig[] = [];

    // WHERE
    if (where) {
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
          if (mapper && operator.includes(placeholder)) {
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
    }

    // JOIN
    if (joins) {
      joins.forEach((join) => {
        const appendCondition = join.appendCondition;

        if (appendCondition) {
          let valueToCompare = appendCondition.valueToCompare;

          if (valueToCompare.includes("${")) {
            for (const key in inputs) {
              const placeholder = `\${${key}}`;
              if (valueToCompare.includes(placeholder)) {
                valueToCompare = valueToCompare.replace(
                  placeholder,
                  inputs[key]
                );
                break;
              }
            }
          }

          const fieldValue = inputs[appendCondition.fieldId];
          if (fieldValue !== valueToCompare) return;
        }

        let type = join.type;
        let sourceModel = join.sourceModel;
        let targetModel = join.targetModel;

        const validConditions: JoinCondition[] = [];
        join.conditions.forEach((cond) => {
          let sourceField = cond.sourceField;
          let targetField = cond.targetField;
          let operator = cond.operator;

          let allPlaceholdersReplaced = true;

          for (const key in inputs) {
            const placeholder = `\${${key}}`;

            if (sourceField.includes(placeholder)) {
              sourceField = sourceField.replace(placeholder, inputs[key]);
            }
            if (targetField.includes(placeholder)) {
              targetField = targetField.replace(placeholder, inputs[key]);
            }
            if (mapper && operator.includes(placeholder)) {
              operator = mapper[key] ? mapper[key][inputs[key]] : inputs[key];
            }
          }

          if (sourceField.includes("${") || targetField.includes("${")) {
            allPlaceholdersReplaced = false;
          }

          if (allPlaceholdersReplaced) {
            validConditions.push({ sourceField, targetField, operator });
          }
        });

        let allPlaceholdersReplacedInJoin = true;
        for (const key in inputs) {
          const placeholder = `\${${key}}`;

          if (type.includes(placeholder)) {
            type = type.replace(placeholder, inputs[key]);
          }
          if (sourceModel.includes(placeholder)) {
            sourceModel = sourceModel.replace(placeholder, inputs[key]);
          }
          if (targetModel.includes(placeholder)) {
            targetModel = targetModel.replace(placeholder, inputs[key]);
          }
        }

        if (
          type.includes("${") ||
          sourceModel.includes("${") ||
          targetModel.includes("${")
        ) {
          allPlaceholdersReplacedInJoin = false;
        }

        if (allPlaceholdersReplacedInJoin && validConditions.length > 0) {
          joinParts.push({
            type,
            sourceModel,
            targetModel,
            conditions: validConditions,
          });
        }
      });
    }

    return { ...selected_config, where: whereParts, joins: joinParts };
  }

  _config_parser_to_query(config: Config, db: "mongo" | "sql") {
    return db === "mongo"
      ? this._create_mongo_query(config)
      : this._create_sql_query(config);
  }

  _create_sql_query(config: Config) {
    const { model, select } = config;

    const sqlQuery = `SELECT ${select.join(", ")} FROM ${model};`;

    return sqlQuery;
  }

  _create_mongo_query(config: Config) {
    const { model, select } = config;

    const aggregationPipeline = [
      {
        $project: select.reduce(
          (proj, field) => ({ ...proj, [field.column]: 1 }),
          {}
        ),
      },
    ];
    return aggregationPipeline;
  }
}

QueryBuilder.registerDialect(new QueryResolver());

export { QueryBuilder };
