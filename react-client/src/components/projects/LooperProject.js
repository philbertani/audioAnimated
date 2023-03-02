import React from "react";

import Sections from "./Sections";

const LooperProject = ({ project, userId, projectId }) => {
  const { sections, graphicsFn } = project;
  return (
    <Sections
      sections={sections}
      userId={userId}
      projectId={projectId}
      graphicsFn={graphicsFn}
    />
  );
};

export default LooperProject;
