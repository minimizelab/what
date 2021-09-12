import React from 'react';

type Props = {
  img?: string;
  title: string;
};

const ProjectCard: React.FC<Props> = ({ img, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <img src={img} alt="Main image" />
    </div>
  );
};

export default ProjectCard;
