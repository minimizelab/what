import { FC } from 'react';
import { Project } from '../../types';
import TextMedium from '../atoms/TextMedium';

type Props = {
  project: Project;
};

const ProjectInfoBox: FC<Props> = ({ project }) => {
  const { assignment, clients, awards, year, location, size, collaborators } =
    project;

  const projectInfoItem = (title: string, value: string | string[]) => (
    <tr>
      <td className="align-top pb-3 pr-4 sm:pr-10 lg:whitespace-nowrap">
        <TextMedium className="font-medium">{title}</TextMedium>
      </td>
      {typeof value === 'string' ? (
        <td className="align-top pb-3 lg:whitespace-nowrap">
          <TextMedium>{value}</TextMedium>
        </td>
      ) : (
        <td className="align-top pb-3 lg:whitespace-nowrap">
          {value.map((item: string, i: number) => (
            <TextMedium key={item + i}>{item}</TextMedium>
          ))}
        </td>
      )}
    </tr>
  );
  return (
    <table>
      <tbody>
        {assignment && projectInfoItem('Uppdrag', assignment)}
        {clients && projectInfoItem('Beställare', clients)}
        {collaborators && projectInfoItem('Samarbetspartners', collaborators)}
        {location && projectInfoItem('Plats', location)}
        {size && projectInfoItem('Storlek', size)}
        {year && projectInfoItem('År', year)}
        {awards && projectInfoItem('Utmärkelser', awards)}
      </tbody>
    </table>
  );
};

export default ProjectInfoBox;
