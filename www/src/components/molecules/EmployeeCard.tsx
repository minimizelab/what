import { FC } from 'react';
import { Employee } from '../../types';
import TextMedium from '../atoms/TextMedium';
import { SanityImage } from '../atoms/SanityImage';

type Props = {
  employee: Employee;
};

const EmployeeCard: FC<Props> = ({ employee }) => {
  return (
    <div className="flex flex-col">
      <div className="relative flex-1 mb-2">
        {employee.image && (
          <SanityImage
            img={employee.image}
            layout="responsive"
            width="360"
            height="400"
            objectFit="cover"
            objectPosition="center"
            alt={'image of employee ' + employee.name}
          />
        )}
      </div>
      <TextMedium className="leading-snug text-what-brick">
        {employee.name}
      </TextMedium>
      <TextMedium className="leading-snug">{employee.titles}</TextMedium>
      <TextMedium className="leading-snug">
        <a
          className="hover:text-what-brick cursor-pointer"
          href={`mailto:${employee.email}`}
        >
          {employee.email}
        </a>
      </TextMedium>
      <TextMedium className="leading-snug">
        <a
          className="hover:text-what-brick cursor-pointer"
          href={`callto:${employee.phone}`}
        >
          {employee.phone}
        </a>{' '}
      </TextMedium>
    </div>
  );
};

export default EmployeeCard;
