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
  ColumnFunction,
  Condition,
  Config,
  example_query_config,
  GroupByConfig,
  InputQueryResolver,
  JoinCondition,
  JoinConfig,
  SortConfig,
  SortDefault,
  TreeConfig,
} from "./config/query-config";
import { v4 as uuidv4 } from "uuid";

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
    inputs: InputQueryResolver,
    config: TreeConfig,
    config_id: string
  ): Config {
    const selected_config = config[config_id];

    if (!selected_config) throw new Error("T o D o");

    const { where, mapper, joins, sort, groupBy } = selected_config;

    const whereParts: Condition[] = [];
    const joinParts: JoinConfig[] = [];
    const sortParts: SortConfig[] = [];
    const groupByParts: Array<string | GroupByConfig> = [];

    const selected_input = inputs[config_id];

    // WHERE
    if (where) {
      where.forEach((condition) => {
        if (!(condition.field && condition.operator && condition.value)) return;

        let field = condition.field;

        if (field.includes("${")) {
          const fieldWithoutTag = this._remove_tags(field);
          const inputV = selected_input.find(
            (value) => value.fieldId === fieldWithoutTag
          );

          if (!inputV) {
            return;
          }

          field =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        let operator = condition.operator;

        if (operator.includes("${")) {
          const operatorWithoutTag = this._remove_tags(operator);
          const inputV = selected_input.find(
            (value) => value.fieldId === operatorWithoutTag
          );

          if (!inputV) {
            return;
          }

          operator =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        let value = condition.value;

        if (typeof value === "string" && value.includes("${")) {
          const valueWithoutTag = this._remove_tags(value);
          const inputV = selected_input.find(
            (value) => value.fieldId === valueWithoutTag
          );

          if (!inputV) {
            return;
          }

          value =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : inputV.value;
        }

        whereParts.push({ field, operator, value });
      });
    }

    // JOIN
    if (joins) {
      joins.forEach((join) => {
        const appendCondition = join.appendCondition;

        if (appendCondition) {
          let valueToCompare = appendCondition.valueToCompare;

          if (valueToCompare.includes("${")) {
            const valueWithoutTag = this._remove_tags(valueToCompare);
            const inputV = selected_input.find(
              (value) => value.fieldId === valueWithoutTag
            );

            if (!inputV) {
              return;
            }

            valueToCompare =
              mapper && mapper[inputV.fieldId]
                ? mapper[inputV.fieldId][inputV.value]
                : (inputV.value as string);
          }

          const fieldValue = selected_input.find(
            (value) => value.fieldId === appendCondition.fieldId
          );
          if (fieldValue?.value !== valueToCompare) return;
        }

        let type = join.type;

        if (type.includes("${")) {
          const typeWithoutTag = this._remove_tags(type);
          const inputV = selected_input.find(
            (value) => value.fieldId === typeWithoutTag
          );

          if (!inputV) {
            return;
          }

          type =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        let sourceModel = join.sourceModel;

        if (sourceModel.includes("${")) {
          const sourceWithoutTag = this._remove_tags(sourceModel);
          const inputV = selected_input.find(
            (value) => value.fieldId === sourceWithoutTag
          );

          if (!inputV) {
            return;
          }

          sourceModel =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        let targetModel = join.targetModel;

        if (targetModel.includes("${")) {
          const targetWithoutTag = this._remove_tags(targetModel);
          const inputV = selected_input.find(
            (value) => value.fieldId === targetWithoutTag
          );

          if (!inputV) {
            return;
          }

          targetModel =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        const validConditions: JoinCondition[] = [];
        join.conditions.forEach((cond) => {
          let sourceField = cond.sourceField;

          if (sourceField.includes("${")) {
            const sourceWithoutTag = this._remove_tags(sourceField);
            const inputV = selected_input.find(
              (value) => value.fieldId === sourceWithoutTag
            );

            if (!inputV) {
              return;
            }
            sourceField =
              mapper && mapper[inputV.fieldId]
                ? mapper[inputV.fieldId][inputV.value]
                : (inputV.value as string);
          }

          let targetField = cond.targetField;

          if (targetField.includes("${")) {
            const targetWithoutTag = this._remove_tags(targetField);
            const inputV = selected_input.find(
              (value) => value.fieldId === targetWithoutTag
            );

            if (!inputV) {
              return;
            }

            targetField =
              mapper && mapper[inputV.fieldId]
                ? mapper[inputV.fieldId][inputV.value]
                : (inputV.value as string);
          }

          let operator = cond.operator;

          if (operator.includes("${")) {
            const operatorWithoutTag = this._remove_tags(operator);
            const inputV = selected_input.find(
              (value) => value.fieldId === operatorWithoutTag
            );

            if (!inputV) {
              return;
            }

            operator =
              mapper && mapper[inputV.fieldId]
                ? mapper[inputV.fieldId][inputV.value]
                : (inputV.value as string);
          }

          validConditions.push({ sourceField, targetField, operator });
        });

        if (validConditions.length > 0) {
          joinParts.push({
            type,
            sourceModel,
            targetModel,
            conditions: validConditions,
          });
        }
      });
    }

    // SORT
    if (sort) {
      sort.forEach((sort) => {
        const appendCondition = sort.appendCondition;

        if (appendCondition) {
          let valueToCompare = appendCondition.valueToCompare;

          if (valueToCompare.includes("${")) {
            const valueWithoutTag = this._remove_tags(valueToCompare);
            const inputV = selected_input.find(
              (value) => value.fieldId === valueWithoutTag
            );

            if (!inputV) {
              return;
            }

            valueToCompare =
              mapper && mapper[inputV.fieldId]
                ? mapper[inputV.fieldId][inputV.value]
                : (inputV.value as string);
          }

          const fieldValue = selected_input.find(
            (value) => value.fieldId === appendCondition.fieldId
          );
          if (fieldValue?.value !== valueToCompare) return;
        }

        let field = sort.field;

        if (field.includes("${")) {
          const sourceWithoutTag = this._remove_tags(field);
          const inputV = selected_input.find(
            (value) => value.fieldId === sourceWithoutTag
          );

          if (!inputV) {
            return;
          }

          field =
            mapper && mapper[inputV.fieldId]
              ? mapper[inputV.fieldId][inputV.value]
              : (inputV.value as string);
        }

        sortParts.push({
          type: sort.type,
          field,
          order: sort.order,
          nulls: sort.nulls,
        });
      });
    }

    // GROUP BY
    if (groupBy) {
      groupBy.forEach((groupByValue) => {
        if (typeof groupByValue !== "string") {
          const appendCondition = groupByValue.appendCondition;

          if (appendCondition) {
            let valueToCompare = appendCondition.valueToCompare;

            if (valueToCompare.includes("${")) {
              const valueWithoutTag = this._remove_tags(valueToCompare);
              const inputV = selected_input.find(
                (value) => value.fieldId === valueWithoutTag
              );

              if (!inputV) {
                return;
              }

              valueToCompare =
                mapper && mapper[inputV.fieldId]
                  ? mapper[inputV.fieldId][inputV.value]
                  : (inputV.value as string);
            }

            const fieldValue = selected_input.find(
              (value) => value.fieldId === appendCondition.fieldId
            );
            if (fieldValue?.value !== valueToCompare) return;
          }
        }

        groupByParts.push(groupByValue);
      });
    }

    return { ...selected_config, where: whereParts, joins: joinParts };
  }

  _config_parser_to_query(db: "mongo" | "sql", config: Config) {
    return db === "mongo"
      ? this._create_mongo_query(config)
      : this._create_sql_query(config);
  }

  _create_sql_query(config: Config) {
    const { model, select, where, joins, sort, pagination, groupBy } = config;

    if (!select || !model) return null;

    const selectClause = `SELECT ${select
      .map((v) => {
        const columnWithModel = `${model}.${v.column}`;
        const columnWithFunction = v.function
          ? `${v.function}(${columnWithModel})`
          : columnWithModel;
        return v.as ? `${columnWithFunction} AS ${v.as}` : columnWithFunction;
      })
      .join(", ")}`;

    const fromClause = `FROM ${model} ${model}`;

    const reducer = TreeStore(this.config);

    let joinClauses = "";

    if (joins && joins.length) {
      joinClauses = joins
        .map((join) => {
          const joinType = join.type;
          const targetModel = join.targetModel;
          const joinConditions = join.conditions
            .map((condition) => {
              // TODO - Operator
              // const state: TreeState = reducer({
              //   tree: Utils.loadTree({
              //     id: uuidv4(),
              //     type: "group",
              //     children1: [
              //       {
              //         id: uuidv4(),
              //         type: "rule",
              //         properties: {
              //           field: `${join.sourceModel}.${condition.sourceField}`,
              //           operator: condition.operator,
              //           value: [`${targetModel}.${condition.targetField}`],
              //           valueSrc: ["value"],
              //         },
              //       },
              //     ],
              //   }),
              // });

              // return Utils.sqlFormat(state.tree, this.config);
              const sourceField = `${join.sourceModel}.${condition.sourceField}`;
              const targetField = `${targetModel}.${condition.targetField}`;
              return `${sourceField} = ${targetField}`;
            })
            .join(" AND ");
          return `${joinType} JOIN ${targetModel} ON ${joinConditions}`;
        })
        .join(" ");
    }

    let whereClause = "";

    if (where && where.length) {
      // WHERE
      const state: TreeState = reducer({
        tree: Utils.loadTree({
          id: uuidv4(),
          type: "group",
          children1: where!.map((value) => {
            return {
              id: uuidv4(),
              type: "rule",
              properties: {
                field: value.field,
                operator: value.operator,
                value: [value.value],
                valueSrc: ["value"],
              },
            };
          }),
        }),
      });
      whereClause = `WHERE ${Utils.sqlFormat(state.tree, this.config)}`;
    }

    let groupByClause = "";
    if (groupBy && groupBy.length) {
      const groupByFields = groupBy
        .map((groupByConfig) =>
          typeof groupByConfig === "string"
            ? groupByConfig
            : groupByConfig.column
        )
        .join(", ");

      if (groupByFields) {
        groupByClause = `GROUP BY ${groupByFields}`;
      }
    }

    // Construct the ORDER BY clause for sorting
    let orderByClause = "";
    if (sort && sort.length) {
      const sortFields = sort
        .map((sortConfig) => {
          const field = sortConfig.field;
          const order = sortConfig.order || "ASC";
          const nulls = (sortConfig as SortDefault).nulls
            ? `NULLS ${(sortConfig as SortDefault).nulls}`
            : "";
          return `${field} ${order} ${nulls}`.trim();
        })
        .join(", ");

      if (sortFields) {
        orderByClause = `ORDER BY ${sortFields}`;
      }
    }

    let paginationClause = "";

    if (pagination) {
      paginationClause = `LIMIT ${pagination.limit}`;
      if (pagination.skip) {
        paginationClause += ` OFFSET ${pagination.skip}`;
      }
    }

    // Combine the clauses to form the final query
    const sqlParts = [
      selectClause,
      fromClause,
      joinClauses,
      whereClause,
      groupByClause,
      orderByClause,
      paginationClause,
    ].filter(Boolean);
    const sqlQuery = sqlParts.join(" ");

    return sqlQuery;
  }

  _create_mongo_query(config: Config) {
    const { model, select, where, joins, sort } = config;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aggregationPipeline: any[] = [];

    const reducer = TreeStore(this.config);

    // Construct the $lookup stages for joins
    if (joins && joins.length) {
      joins.forEach((join) => {
        const letFieldsObj: { [key: string]: string } = {};
        const joinConditions: { $expr: { $eq: string[] } }[] = [];
        join.conditions.forEach((condition) => {
          letFieldsObj[
            `${condition.sourceField}`
          ] = `$${condition.sourceField}`;

          joinConditions.push({
            $expr: {
              $eq: [`$${condition.targetField}`, `$$${condition.sourceField}`],
            },
          });
        });

        aggregationPipeline.push({
          $lookup: {
            from: join.targetModel,
            let: letFieldsObj,
            pipeline: [
              {
                $match: {
                  $and: joinConditions,
                },
              },
            ],
            as: join.targetModel,
          },
        });

        // Flatten the joined documents
        aggregationPipeline.push({
          $unwind: {
            path: `$${join.targetModel}`,
            preserveNullAndEmptyArrays: true,
          },
        });
      });
    }

    // Construct the $match stage for where conditions
    if (where && where.length) {
      const state: TreeState = reducer({
        tree: Utils.loadTree({
          id: uuidv4(),
          type: "group",
          children1: where!.map((value) => {
            return {
              id: uuidv4(),
              type: "rule",
              properties: {
                field: value.field,
                operator: value.operator,
                value: [value.value],
                valueSrc: ["value"],
              },
            };
          }),
        }),
      });

      aggregationPipeline.push({
        $match: Utils.mongodbFormat(state.tree, this.config),
      });
    }

    if (sort && sort.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortFields: { [key: string]: any } = {};

      sort.forEach((sortConfig) => {
        const field = sortConfig.field;
        const order = sortConfig.order === "DESC" ? -1 : 1;

        if (sortConfig.nulls) {
          if (sortConfig.nulls === "FIRST") {
            sortFields[field] = { $ifNull: [`$${field}`, -Infinity] };
          } else {
            sortFields[field] = { $ifNull: [`$${field}`, Infinity] };
          }
        } else {
          sortFields[field] = order;
        }
      });

      aggregationPipeline.push({ $sort: sortFields });
    }

    // Construct the $project stage for select fields
    if (select && select.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const projectFields: { [key: string]: any } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const addFields: { [key: string]: any } = {};

      select.forEach((field) => {
        const fieldName = field.as || field.column;
        if (field.function) {
          switch (field.function) {
            case ColumnFunction.SUM:
              addFields[fieldName] = { $sum: `$${field.column}` };
              break;
            case ColumnFunction.AVG:
              addFields[fieldName] = { $avg: `$${field.column}` };
              break;
            case ColumnFunction.MAX:
              addFields[fieldName] = { $max: `$${field.column}` };
              break;
            case ColumnFunction.MIN:
              addFields[fieldName] = { $min: `$${field.column}` };
              break;
            case ColumnFunction.COUNT:
              addFields[fieldName] = { $sum: 1 };
              break;
            default:
              throw new Error(`Unsupported function: ${field.function}`);
          }
        } else {
          projectFields[fieldName] = `$${field.column}`;
        }
      });

      if (Object.keys(addFields).length > 0) {
        aggregationPipeline.push({ $addFields: addFields });
      }

      if (Object.keys(projectFields).length > 0) {
        aggregationPipeline.push({ $project: projectFields });
      }
    }

    return aggregationPipeline;
  }

  private _remove_tags(str: string): string | number | boolean {
    const tagPattern = /^\$\{(.+)\}$/;
    const match = str.match(tagPattern);
    return match ? match[1] : str;
  }
}

QueryBuilder.registerDialect(new QueryResolver());

export { QueryBuilder };
