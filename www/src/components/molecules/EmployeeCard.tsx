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
      <div className="relative block flex-1 mb-2 pt-111">
        {employee.image && (
          <SanityImage
            className="object-cover object-center"
            img={employee.image}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            alt={'image of employee ' + employee.name}
          />
        )}
      </div>
      <TextMedium className="leading-snug text-what-red-01">
        {employee.name}
      </TextMedium>
      <TextMedium className="leading-snug">{employee.titles}</TextMedium>
      <TextMedium className="leading-snug">
        <a
          className="hover:text-what-red-01 cursor-pointer"
          href={`mailto:${employee.email}`}
        >
          {employee.email}
        </a>
      </TextMedium>
      <TextMedium className="leading-snug">
        <a
          className="hover:text-what-red-01 cursor-pointer"
          href={`callto:${employee.phone}`}
        >
          {employee.phone}
        </a>{' '}
      </TextMedium>
    </div>
  );
};

export default EmployeeCard;
