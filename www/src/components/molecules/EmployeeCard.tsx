import React, { FC } from 'react';
import Image from 'next/image';
import { Employee } from '../../types';
import TextMedium from '../atoms/TextMedium';

type Props = {
  employee: Employee;
};

const EmployeeCard: FC<Props> = ({ employee }) => {
  return (
    <div className="flex flex-col">
      <div className="relative flex-1 mb-2">
        {employee.image && (
          <Image
            layout="responsive"
            width="360"
            height="400"
            objectFit="cover"
            objectPosition="center"
            src={employee.image.url}
            alt="Main image"
          />
        )}
      </div>
      <TextMedium className="leading-snug text-what-brick">
        {employee.name}
      </TextMedium>
      <TextMedium className="leading-snug">{employee.titles}</TextMedium>
      <TextMedium className="leading-snug">
        <a className="hover:text-what-brick" href={`mailto:${employee.email}`}>
          {employee.email}
        </a>
      </TextMedium>
      <TextMedium className="leading-snug">
        <a className="hover:text-what-brick" href={`callto:${employee.phone}`}>
          {employee.phone}
        </a>{' '}
      </TextMedium>
    </div>
  );
};

export default EmployeeCard;
