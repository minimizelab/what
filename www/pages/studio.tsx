import React, { FC } from 'react';
import Page from '../src/components/templates/Page';
import sanity from '../src/services/sanity';
import { GetStaticProps } from 'next';
import { revalidate } from '../src/config/defaults';
import { Employee, Studio } from '../src/types';
import EmployeeCard from '../src/components/molecules/EmployeeCard';
import getSortedArray from '../src/utils/getSortedArray';

type Props = { employees: Employee[]; studio: Studio };

const StudioPage: FC<Props> = ({ employees }) => (
  <Page className="pb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {employees.map((employee) => (
        <EmployeeCard key={employee.email} employee={employee}></EmployeeCard>
      ))}
    </div>
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [allEmployees, studio] = await Promise.all([
    sanity.getEmployees(),
    sanity.getStudio(),
  ]);
  const employees = getSortedArray<Employee>(allEmployees, studio.employees);
  return {
    props: { employees, studio },
    revalidate,
  };
};

export default StudioPage;
