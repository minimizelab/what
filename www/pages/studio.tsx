import React, { FC } from 'react';
import Page from '../src/components/templates/Page';
import { PortableText } from '@portabletext/react';
import sanity from '../src/services/sanity';
import { GetStaticProps } from 'next';
import { revalidate } from '../src/config/defaults';
import { DefaultPageProps, Employee, Studio } from '../src/types';
import EmployeeCard from '../src/components/molecules/EmployeeCard';
import getSortedArray from '../src/utils/getSortedArray';
import serializers from '../src/lib/serializers';
import TextMedium from '../src/components/atoms/TextMedium';

type Props = DefaultPageProps & { employees: Employee[]; studio: Studio };

const Block: FC = ({ children }) => (
  <p className="lg:w-2/3 w-full text-3xl">{children}</p>
);

const StudioPage: FC<Props> = ({ employees, studio, settings }) => (
  <Page className="pb-8" settings={settings}>
    <div className="flex flex-col items-start">
      <PortableText
        value={studio.pageContent}
        components={{ ...serializers, block: Block }}
      />
      <div className="flex flex-row mt-10 w-full">
        <TextMedium className="font-medium w-32">Telefon</TextMedium>
        <TextMedium className="flex-1">
          <a
            className="hover:text-what-brick"
            href={`callto:${settings.phone}`}
          >
            {settings.phone}
          </a>
        </TextMedium>
      </div>
      <div className="flex flex-row mt-4 w-full">
        <TextMedium className="font-medium w-32">Mail</TextMedium>
        <TextMedium className="flex-1">
          <a
            className="hover:text-what-brick"
            href={`mailto:${settings.email}`}
          >
            {settings.email}
          </a>
        </TextMedium>
      </div>
      <div className="flex flex-row mt-4 w-full">
        <TextMedium className="font-medium w-32">Address</TextMedium>
        <TextMedium className="flex flex-col flex-1">
          {settings.address.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </TextMedium>
      </div>
      <div className="flex flex-row mt-4 w-full">
        <TextMedium className="font-medium w-32">Jobb</TextMedium>
        <TextMedium className="flex-1">
          {'Skicka CV & portfolio till '}
          <a
            className="hover:text-what-brick"
            href={`mailto:${settings.emailJob}`}
          >
            {settings.emailJob}
          </a>
        </TextMedium>
      </div>
    </div>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
