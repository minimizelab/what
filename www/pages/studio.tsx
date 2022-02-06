import React, { FC } from 'react';
import Page from '../src/components/templates/Page';
import { PortableText } from '@portabletext/react';
import sanity from '../src/services/sanity';
import { GetStaticProps } from 'next';
import { revalidate } from '../src/config/defaults';
import { Employee, Settings, Studio } from '../src/types';
import EmployeeCard from '../src/components/molecules/EmployeeCard';
import getSortedArray from '../src/utils/getSortedArray';
import serializers from '../src/lib/serializers';

type Props = { employees: Employee[]; studio: Studio; settings: Settings };

const Block: FC = ({ children }) => (
  <p className="lg:w-2/3 w-full text-3xl">{children}</p>
);

const StudioPage: FC<Props> = ({ employees, studio, settings }) => (
  <Page className="pb-8" settings={settings}>
    <div className="flex flex-row justify-start mb-16">
      <PortableText
        value={studio.pageContent}
        components={{ ...serializers, block: Block }}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {employees.map((employee) => (
        <EmployeeCard key={employee.email} employee={employee}></EmployeeCard>
      ))}
    </div>
  </Page>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [allEmployees, studio, settings] = await Promise.all([
    sanity.getEmployees(),
    sanity.getStudio(),
    sanity.getSettings(),
  ]);
  const employees = getSortedArray<Employee>(allEmployees, studio.employees);
  return {
    props: { employees, studio, settings },
    revalidate,
  };
};

export default StudioPage;
