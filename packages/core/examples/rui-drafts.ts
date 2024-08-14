const uiConfig = {
  geographic: {
    field_1: {
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
    field_2: {
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
    field_3: {
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
      id: "field_1",
      value: "Is not currently in",
    },
    {
      id: "field_2",
      value: "Country",
    },
    {
      id: "field_3",
      value: "USA",
    },
  ],
};

const dataConfig = {
  geographic: {
    model: "User",
    select: ["id", "name"],
    // joins: ["${field_4}"],
    where: [
      {
        field: "${field_2}",
        operator: "${field_1}",
        value: "${field_3}",
      },
    ],
    mapper: {
      field_1: {
        "Is not currently in": "not_equal",
        "Is currently in": "equal",
      },
      // field_4: {
      //   Country: {
      //     model: "countries",
      //     select: ["id", "name"],
      //     on: {
      //       "User.countryId": "Country.id",
      //     },
      //     as: "c",
      //   },
      // },
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
