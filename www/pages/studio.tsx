import React, { FC } from 'react';
import Page from '../src/components/templates/Page';
import sanity from '../src/services/sanity';
import { GetStaticProps } from 'next';
import { revalidate } from '../src/config/defaults';
import { Employee } from '../src/types';
import EmployeeCard from '../src/components/molecules/EmployeeCard';

type Props = { employees: Employee[] };

const Studio: FC<Props> = ({ employees }) => (
  <Page className="pb-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:grid-flow-col">
      {employees.map((employee) => (
        <EmployeeCard employee={employee}></EmployeeCard>
      ))}
    </div>
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const employees = await sanity.getEmployees();
  return {
    props: { employees },
    revalidate,
  };
};

export default Studio;
