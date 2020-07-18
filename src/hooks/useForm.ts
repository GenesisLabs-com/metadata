import isEqual from "lodash-es/isEqual";
import { useState } from "react";

import { toggle } from "@saleor/utils/lists";
import { maybe } from "../misc";
import useStateFromProps from "./useStateFromProps";

export interface ChangeEvent<TData = any> {
  target: {
    name: string;
    value: TData;
  };
}

export type FormChange = (event: ChangeEvent, cb?: () => void) => void;

export interface UseFormResult<T> {
  change: FormChange;
  data: T;
  hasChanged: boolean;
  reset: () => void;
  set: (data: T) => void;
  submit: () => void;
  triggerChange: () => void;
  toggleValue: FormChange;
}

type FormData = Record<string, any | any[]>;

function merge<T extends FormData>(prevData: T, prevState: T, data: T): T {
  return Object.keys(prevState).reduce(
    (acc, key) => {
      if (!isEqual(data[key], prevData[key])) {
        acc[key as keyof T] = data[key];
      }

      return acc;
    },
    { ...prevState }
  );
}

function handleRefresh<T extends FormData>(
  data: T,
  newData: T,
  setChanged: (status: boolean) => void
) {
  if (isEqual(data, newData)) {
    setChanged(false);
  }
}

function useForm<T extends FormData>(
  initial: T,
  onSubmit: (data: T) => void
): UseFormResult<T> {
  const [hasChanged, setChanged] = useState(false);
  const [data, setData] = useStateFromProps(initial, {
    mergeFunc: merge,
    onRefresh: newData => handleRefresh(data, newData, setChanged)
  });

  function toggleValue(event: ChangeEvent, cb?: () => void) {
    const { name, value } = event.target;
    const field = data[name as keyof T];

    if (Array.isArray(field)) {
      if (!hasChanged) {
        setChanged(true);
      }
      setData({
        ...data,
        [name]: toggle(value, field, isEqual)
      });
    }

    if (typeof cb === "function") {
      cb();
    }
  }

  function change(event: ChangeEvent) {
    const { name, value } = event.target;
    if (!(name in data)) {
      console.error(`Unknown form field: ${name}`);
      return;
    } else {
      if (data[name] !== value) {
        setChanged(true);
      }
      if(name === "inputType"){
        if(value === "DISCOUNT_CODE4000") {
          maybe(() => {
          const discountCode4000Val = data.array.filter(item => item.key === "DISCOUNT_CODE4000")
          setData(data => ({
            ...data,
            discountValue: discountCode4000Val.length === 0 ? "0" : discountCode4000Val[0].value,
            [name]: value,
          }));
        })}
        else if(value === "DISCOUNT_CODE4020") {
          maybe(() => {
          const discountCode4020Val = data.array.filter(item => item.key === "DISCOUNT_CODE4020")
          setData(data => ({
            ...data,
            discountValue: discountCode4020Val.length === 0 ? "0" : discountCode4020Val[0].value,
            [name]: value,
          }));
        })}
        else if(value === "DISCOUNT_CODE4022") {
          maybe(() => {
          const discountCode4022Val = data.array.filter(item => item.key === "DISCOUNT_CODE4022")
          setData(data => ({
            ...data,
            discountValue: discountCode4022Val.length === 0 ? "0" : discountCode4022Val[0].value,
            [name]: value,
          }));
        })}
        else if(value === "DISCOUNT_CODE4030") {
          maybe(() => {
            const discountCode4030Val = data.array.filter(item => item.key === "DISCOUNT_CODE4030")
            setData(data => ({
              ...data,
              discountValue: discountCode4030Val.length === 0 ? "0" : discountCode4030Val[0].value,
              [name]: value,
            }));
        })}
        else if(value === "DISCOUNT_CODE4040") {
          maybe(() => {
            const discountCode4040Val = data.array.filter(item => item.key === "DISCOUNT_CODE4040")
            setData(data => ({
              ...data,
              discountValue: discountCode4040Val.length === 0 ? "0" : discountCode4040Val[0].value,
              [name]: value,
            }));
          })
        }
      }
      setData(data => ({
        ...data,
        [name]: value
      }));
    }
  }

  function reset() {
    setData(initial);
  }

  function set(newData: Partial<T>) {
    setData(data => ({
      ...data,
      ...newData
    }));
  }

  function submit() {
    return onSubmit(data);
  }

  function triggerChange() {
    setChanged(true);
  }

  return {
    change,
    data,
    hasChanged,
    reset,
    set,
    submit,
    toggleValue,
    triggerChange
  };
}

export default useForm;
