import { describe, expect, it } from "vitest";
import { QueryResolver } from "../src/index";
import { InputQueryResolver } from "../src/config/query-config";
import { random_example, us_example } from "./configs";

describe.skip("Test", () => {
  describe("Where Clauses", () => {
    it("It should return empty array when input is null", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({});

      expect(result.whereParts).toEqual([]);
    });

    it("It should return empty array when input is not complete", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({ field_1: "rui" });

      expect(result.whereParts).toEqual([]);
    });

    it("It should return one where clause", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_1: "Country",
        field_2: "Is not currently in",
        field_3: "USA",
      });

      expect(result.whereParts).toEqual([
        { field: "Country", operator: "not_equal", value: "USA" },
      ]);
    });

    it("It should return two where clause", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_1: "Country",
        field_2: "Is currently in",
        field_3: "USA",
        field_4: "Random",
      });

      expect(result.whereParts).toEqual([
        { field: "Country", operator: "equal", value: "USA" },
        { field: "region", operator: "equal", value: "Random" },
      ]);
    });
  });

  describe("Joins", () => {
    it("It should return one join", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({});

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if the value of field_5 is orders", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_5: "orders",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_7 is set up but field_6 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_7: "random",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if field_6 and field_7 are set up and have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_6: "same_value",
        field_7: "same_value",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "same_value",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_8 and field_10 are set up but field_9 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "random 1",
        field_10: "random 1",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_9 and field_10 are set up but field_8 is not", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_9: "random 1",
        field_10: "random 2",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins if field_8, field_9, field_10 are set up and field_8 and field_10 have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "orders",
        field_9: "random 2",
        field_10: "orders",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "random 2", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join if field_8, field_9, field_10 are set up and field_8 and field_10 have the different values", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_8: "random 1",
        field_9: "random 2",
        field_10: "random 3",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return one join because we didn't set up field_11 and field_15", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_11: "random 1",
        field_13: "random 2",
        field_14: "random 3",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
      ]);
    });

    it("It should return two joins because all fields are set up and field_14 and field_15 have the same value", () => {
      const qr = new QueryResolver();
      const result = qr._just_a_test({
        field_11: "random 1",
        field_12: "random 2",
        field_13: "random 3",
        field_14: "same_value",
        field_15: "same_value",
      });

      expect(result.joinParts).toEqual([
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "orders",
          conditions: [
            { sourceField: "id", targetField: "user_id", operator: "equals" },
          ],
        },
        {
          type: "LEFT",
          sourceModel: "user",
          targetModel: "random 1",
          conditions: [
            {
              sourceField: "random 2",
              targetField: "random 3",
              operator: "equals",
            },
          ],
        },
      ]);
    });
  });
});

describe("Test - _config_replacement + _config_parser_to_query", () => {
  const qr = new QueryResolver();
  describe("Test - sql", () => {
    describe("Random Example", () => {
      const inputQueryResolver: InputQueryResolver = {
        Users: [
          {
            fieldId: "field_1",
            value: "random",
          },
        ],
      };

      it("Random SQL Query", () => {
        const replaced = qr._config_replacement(
          inputQueryResolver,
          random_example,
          "Users"
        );

        const sql_query = qr._config_parser_to_query("sql", replaced);

        expect(sql_query).toEqual(
          "SELECT users.id, users.first_name, users.last_name, Max(users.random) AS random_as, users.random_1 AS new_as" +
            " FROM users users INNER JOIN countries ON users.country_id = countries.id" +
            " WHERE (users.first_name = 'Rui' AND users.age >= 10 AND users.active = true)" +
            " GROUP BY users.id, users.type" +
            " ORDER BY users.id DESC, users.first_name ASC" +
            " LIMIT 10 OFFSET 10"
        );
      });

      it("Random Mongo Aggregation", () => {
        const replaced = qr._config_replacement(
          inputQueryResolver,
          random_example,
          "Users"
        );

        const mongo_aggre = qr._config_parser_to_query("mongo", replaced);

        expect(mongo_aggre).toEqual([
          {
            $lookup: {
              as: "countries",
              from: "countries",
              let: {
                country_id: "$country_id",
              },
              pipeline: [
                {
                  $match: {
                    $and: [
                      {
                        $expr: {
                          $eq: ["$id", "$$country_id"],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            $unwind: {
              path: "$countries",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              "users.active": true,
              "users.age": {
                $gte: 10,
              },
              "users.first_name": "Rui",
            },
          },
          {
            $sort: {
              "users.first_name": 1,
              "users.id": -1,
            },
          },
          {
            $addFields: {
              random_as: {
                $max: "$random",
              },
            },
          },
          {
            $project: {
              first_name: "$first_name",
              id: "$id",
              last_name: "$last_name",
              new_as: "$random_1",
            },
          },
        ]);
      });
    });

    describe("US 1", () => {
      it("SQL Query - Is currently in + Country + USA", () => {
        const inputQueryResolver: InputQueryResolver = {
          Geographic: [
            {
              fieldId: "field_1",
              value: "Is currently in",
            },
            {
              fieldId: "field_2",
              value: "country",
            },
            {
              fieldId: "field_3",
              value: "USA",
            },
          ],
        };

        const replaced = qr._config_replacement(
          inputQueryResolver,
          us_example,
          "Geographic"
        );

        const sql_query = qr._config_parser_to_query("sql", replaced);

        expect(sql_query).toEqual(
          "SELECT users.id, users.first_name, users.last_name FROM users users INNER JOIN countries ON users.country_id = countries.id WHERE countries.name = 'USA'"
        );
      });

      it("SQL Query - Is not currently in + Region + East", () => {
        const inputQueryResolver: InputQueryResolver = {
          Geographic: [
            {
              fieldId: "field_1",
              value: "Is not currently in",
            },
            {
              fieldId: "field_2",
              value: "region",
            },
            {
              fieldId: "field_4",
              value: "east",
            },
          ],
        };

        const replaced = qr._config_replacement(
          inputQueryResolver,
          us_example,
          "Geographic"
        );

        const sql_query = qr._config_parser_to_query("sql", replaced);

        expect(sql_query).toEqual(
          "SELECT users.id, users.first_name, users.last_name FROM users users INNER JOIN regions ON users.region_id = regions.id WHERE regions.name <> 'east'"
        );
      });
    });

    describe("US 2", () => {
      it("SQL Query - Age + Greater Than + 18", () => {
        const inputQueryResolver: InputQueryResolver = {
          Demographic: [
            {
              fieldId: "field_1",
              value: "Age",
            },
            {
              fieldId: "field_4",
              value: "greater",
            },
            {
              fieldId: "field_5",
              value: 18,
            },
          ],
        };

        const replaced = qr._config_replacement(
          inputQueryResolver,
          us_example,
          "Demographic"
        );

        const sql_query = qr._config_parser_to_query("sql", replaced);

        expect(sql_query).toEqual(
          "SELECT users.id, users.first_name, users.last_name FROM users users WHERE users.age > 18"
        );
      });
    });

    describe("US 3", () => {
      it("SQL Query - Did + Purchased Product + Product Added + TV", () => {
        const inputQueryResolver: InputQueryResolver = {
          Behaviour: [
            {
              fieldId: "field_1",
              value: "Did",
            },
            {
              fieldId: "field_2",
              value: "Purchased Product",
            },
            {
              fieldId: "field_3",
              value: "Product Added",
            },
            {
              fieldId: "field_4",
              value: "TV",
            },
          ],
        };

        const replaced = qr._config_replacement(
          inputQueryResolver,
          us_example,
          "Behaviour"
        );

        const sql_query = qr._config_parser_to_query("sql", replaced);

        expect(sql_query).toEqual(
          "SELECT users.id, users.first_name, users.last_name FROM users users INNER JOIN purchased_products ON users.id = purchased_products.user_id WHERE purchased_products.name = 'TV'"
        );
      });
    });
  });
});
