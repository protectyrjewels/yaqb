const uiConfig = {
  geographic: {
    1: {
      components: [
        {
          type: "select",
          options: [
            {
              value: "is_currently_in",
              label: "Is Currently In",
            },
            {
              value: "is_not_currently_in",
              label: "Is Not Currently In",
            },
          ],
          triggerNode: ["second_select"],
        },
      ],
    },
    2: {
      components: [
        {
          type: "select",
          options: [
            {
              value: "country",
              label: "Country",
              triggerNode: ["select_country"],
            },
          ],
        },
      ],
    },
    3: {
      components: [
        {
          type: "select",
          options: [
            {
              value: "usa",
              label: "USA",
            },
          ],
        },
      ],
    },
  },
};

const outputUI = {
  geographic: [
    {
      id: "1",
      value: "Is not currently in",
    },
    {
      id: "2",
      value: "Country",
    },
    {
      id: "3",
      value: "USA",
    },
  ],
};

const dataConfig = {
  Geographic: {
    model: "User",
    select: ["id", "c.name"],
    // joins: ["${4}"],
    where: [
      {
        field: "${2}",
        operator: "${1}",
        value: "${3}",
      },
    ],
    mapper: {
      [1]: {
        "Is not currently in": "not_equal",
        "Is currently in": "equal",
      },
      // [4]: {
      //     "Country": {
      //         model: "countries",
      //         select: ["id", "name"],
      //         on: {
      //             "User.countryId": "Country.id"
      //         },
      //         as: "c"
      //     }
      // }
    },
  },
};

const outputData = "SELECT id, name FROM User u WHERE u.country == 'USA'";

///// ---------------------- /////

export interface Field {
  components: UiComponent[];
}

export type UiComponent = SelectUiComponent;
// | InputUiComponent
// | DateUiComponent
// | RelativeDateUiComponent
// | CheckboxUiComponent
// | HiddenUiComponent
// | RangeUiComponent;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

interface CanEnableOtherFilter {
  triggerNode?: Array<string>;
}

interface OptionUiComponent extends CanEnableOtherFilter {
  value: string | [string, string];
  label: string;
  /**
   * Selected option
   */
  selected?: boolean;
}

interface SelectOptionsUiComponent {
  options: Array<OptionUiComponent>;
}

interface SelectFromQueryUiComponent {
  optionsFromQuery: string;
  bindLabel: string;
  bindValue: string;
  /**
   * Auto select on single option from query
   */
  autoSelectOnSingleOption?: boolean;
}

interface UiComponentBase<Type> extends CanEnableOtherFilter {
  type: Type;
  label?: {
    text: string;
    position: "top" | "right" | "left" | "bottom";
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

type BaseSelectUiComponent = XOR<
  SelectOptionsUiComponent,
  SelectFromQueryUiComponent
> &
  UiComponentBase<"select"> & {
    multiple?: boolean;
  };

export type SelectUiComponent = BaseSelectUiComponent;
