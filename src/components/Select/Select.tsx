import "./scss/index.scss";

import classNames from "classnames";
import { filter, map } from "lodash";
import * as React from "react";

import { IFilteredListArgs, IListArgs, ISelectProps } from "./types";

const renderList = ({ options, onChange }: IListArgs) =>
  map(options, ({ label, value }) => (
    <p
      className="select__option"
      key={value}
      onClick={() => onChange({ country: label, code: value })}
    >
      {label}
    </p>
  ));

const filterList = ({ searchPhrase, options }: IFilteredListArgs) =>
  filter(options, ({ label }) =>
    label.toLowerCase().includes(searchPhrase.toLowerCase())
  );

export const SelectBase = (props: ISelectProps) => {
  const {
    clickedOutside,
    defaultValue,
    label,
    onChange,
    options,
    name,
    setElementRef
  } = props;

  const [open, setOpen] = React.useState(false);
  const [searchPhrase, setSearchPhrase] = React.useState(defaultValue.label);
  const selectRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    setSearchPhrase(defaultValue.label);
  }, [defaultValue]);

  const shouldOpen = clickedOutside ? false : open;
  const shouldSearch = defaultValue.label !== searchPhrase;

  const renderLabel = (label?: string) =>
    label && <label className="input__label">{label}</label>;
  // ref={setElementRef(selectRef)}

  return (
    <div
      className={classNames("react-select select", {
        "select--open": shouldOpen
      })}
    >
      <input
        className="select__hidden"
        name={name}
        defaultValue={defaultValue.value}
      />
      <div>
        {renderLabel(label)}
        <div className="select__title">
          <input
            value={searchPhrase}
            onChange={e => setSearchPhrase(e.target.value)}
            onClick={() => setOpen(!open)}
          />
        </div>

        <div
          className={classNames("select__options", {
            "select__options--open": shouldOpen
          })}
        >
          {renderList({
            onChange,
            options: shouldSearch
              ? filterList({ searchPhrase, options })
              : options
          })}
        </div>
      </div>
    </div>
  );
};

const Select = SelectBase;
export default Select;
