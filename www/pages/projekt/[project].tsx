import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { ImageGrid } from '../../src/components/molecules/ImageGrid';
import ProjectHeader from '../../src/components/organisms/ProjectHeader';
import Page from '../../src/components/templates/Page';
import sanity from '../../src/services/sanity';
import { Project, Settings } from '../../src/types';

type Params = { project: string };
type Props = {
  project: Project;
  settings: Settings;
};

const ProjectPage: FC<Props> = ({ project, settings }) => {
  const images = project.images.slice(1).map((obj) => obj.asset);
  const router = useRouter();
  return (
    <Page settings={settings} className="items-center">
      <article className="w-full max-w-7xl flex flex-col">
        <ProjectHeader project={project} />
        <ImageGrid images={images} />
        <div className="flex flex-col-reverse items-start sm:flex-row justify-between mt-8">
          <button
            className="underline hover:text-what-brick cursor-pointer"
            onClick={router.back}
          >
            tillbaka
          </button>
          <p>{project.credits}</p>
        </div>
      </article>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const projects = await sanity.getProjects();
  const paths = projects.map(({ path }) => ({
    params: { project: path.current },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const [project, settings] = await Promise.all([
    sanity.getProject(params?.project),
    sanity.getSettings(),
  ]);
  return {
    props: { project, settings },
  };
};

export default ProjectPage;
