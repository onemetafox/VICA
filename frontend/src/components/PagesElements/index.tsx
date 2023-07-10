import React, { FC, PropsWithChildren } from 'react';

type OrderedListWrapperProps = {
  marginLeft?: string;
};

export const Paragraph: FC<PropsWithChildren<unknown>> = (props) => {
  return <p className="my-4 leading-relaxed" {...props} />;
};

export const OrderedListWrapper: FC<
  PropsWithChildren<OrderedListWrapperProps>
> = ({ marginLeft = 'ml-10', ...props }: OrderedListWrapperProps) => {
  return (
    <ol
      className={`${marginLeft} my-12 text-lg  font-bold sm:ml-0 axs:text-base axs:my-5`}
      {...props}
    />
  );
};

export const SubOrderedList: FC<PropsWithChildren<unknown>> = (props) => (
  <ol className="ml-5 mt-5 text-lg sm:ml-0 axs:text-base axs:mt-3" {...props} />
);
export const ListElement: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <li className="text-base font-bold axs:text-sm">
    <span className="ml-5 mb-5 block font-normal sm:ml-0">{children}</span>
  </li>
);

export const UnorderedList: FC<PropsWithChildren<unknown>> = (props) => (
  <ul className="ml-10 mt-5 sm:ml-0" {...props} />
);
