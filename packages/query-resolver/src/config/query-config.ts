export interface Mapper {
  [key: string]: { [key: string]: string };
}

export interface Condition {
  field: string;
  operator: string;
  value: string;
}

export interface Config {
  Geographic: {
    model: string;
    select: string[];
    joins: string[];
    where: Condition[];
    mapper: Mapper;
  };
}

export const example_query_config: Config = {
  Geographic: {
    model: "User",
    select: ["id", "name"],
    where: [
      {
        field: "${field_1}",
        operator: "${field_2}",
        value: "${field_3}",
      },
      {
        field: "region",
        operator: "equal",
        value: "${field_4}",
      },
    ],
    mapper: {
      field_2: {
        "Is not currently in": "not_equal",
        "Is currently in": "equal",
      },
    },
    joins: [],
  },
};
