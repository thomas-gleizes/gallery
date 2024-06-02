import { NextPage } from "next";
import React from "react";
import { useParams } from "next/navigation";

import FilesView from "@/components/FilesView";

const DirectoryPage: NextPage = () => {
  const params = useParams();
  const paths = (params?.path || [""]) as string[];

  return <FilesView paths={paths} />;
};

export default DirectoryPage;
