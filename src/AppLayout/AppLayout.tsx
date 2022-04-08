import DefaultLayout from "layouts/DefaultLayout/DefaultLayout";
import React from "react";
import { Outlet } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

const AppLayout = ({ children }: Props) => {
  return <DefaultLayout>{children ?? <Outlet />}</DefaultLayout>;
};

export default AppLayout;
