import { NextPage } from "next";
import React from "react";

import FilesView from "@/components/FilesView";

const Index: NextPage = () => {
  return <FilesView paths={[]} />;
};

export default Index;
